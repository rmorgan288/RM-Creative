"""
Rhys Morgan Creative Marketing — Backend API
- JWT-protected admin
- Proposals CRUD (public read by slug; admin write)
- Proposal action log (approve / revision / decline)
- File uploads served at /api/uploads/<filename>
- Hidden from public site: no admin links anywhere on public pages
"""

import hmac
import os
import re
import uuid
import logging
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import List, Optional, Any, Dict

import jwt
from dotenv import load_dotenv
from fastapi import (
    APIRouter,
    Depends,
    FastAPI,
    File,
    HTTPException,
    Request,
    UploadFile,
    status,
)
from fastapi.responses import FileResponse, JSONResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from starlette.middleware.cors import CORSMiddleware

# ---------------------------------------------------------------------------
# Setup
# ---------------------------------------------------------------------------
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "")
JWT_SECRET = os.environ.get("JWT_SECRET", "")
JWT_ALG = os.environ.get("JWT_ALG", "HS256")
JWT_TTL_HOURS = int(os.environ.get("JWT_TTL_HOURS", "24"))
UPLOAD_DIR = Path(os.environ.get("UPLOAD_DIR", "/app/backend/uploads"))
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_IMAGE_EXT = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_UPLOAD_BYTES = 8 * 1024 * 1024  # 8MB

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]
proposals_col = db["proposals"]
actions_col = db["proposal_actions"]
contact_col = db["contact_submissions"]
site_content_col = db["site_content"]

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("rm-backend")

app = FastAPI(title="Rhys Morgan — Backend")
api = APIRouter(prefix="/api")
bearer = HTTPBearer(auto_error=False)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Auth helpers
# ---------------------------------------------------------------------------
def create_token() -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": "admin",
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(hours=JWT_TTL_HOURS)).timestamp()),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


async def require_admin(
    creds: Optional[HTTPAuthorizationCredentials] = Depends(bearer),
):
    if creds is None or not creds.credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(creds.credentials, JWT_SECRET, algorithms=[JWT_ALG])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    if payload.get("sub") != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")
    return payload


# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------
class LoginIn(BaseModel):
    password: str


class TokenOut(BaseModel):
    token: str
    expires_in_hours: int


class TimelineItem(BaseModel):
    phase: str = ""
    weeks: str = ""
    body: str = ""


class ScopeModel(BaseModel):
    summary: str = ""
    goals: List[str] = Field(default_factory=list)
    deliverables: List[str] = Field(default_factory=list)
    timeline: List[TimelineItem] = Field(default_factory=list)


class ConceptItem(BaseModel):
    name: str = ""
    direction: str = ""
    image: str = ""


class TierItem(BaseModel):
    name: str = ""
    tag: str = ""
    price: str = ""
    cadence: str = "project"
    summary: str = ""
    includes: List[str] = Field(default_factory=list)
    featured: bool = False


class InvestmentModel(BaseModel):
    currency: str = "£"
    note: str = ""
    tiers: List[TierItem] = Field(default_factory=list)


class ProposalIn(BaseModel):
    slug: str
    status: str = "draft"  # 'draft' | 'published'
    client: str
    projectTitle: str = ""
    preparedFor: str = ""
    preparedBy: str = "Rhys Morgan, Creative Marketing"
    preparedDate: Optional[str] = None
    validUntil: Optional[str] = None
    reference: str = ""
    coverImage: Optional[str] = None
    intro: str = ""
    scope: ScopeModel = Field(default_factory=ScopeModel)
    concepts: List[ConceptItem] = Field(default_factory=list)
    investment: InvestmentModel = Field(default_factory=InvestmentModel)
    terms: List[str] = Field(default_factory=list)


class ProposalOut(ProposalIn):
    id: str
    createdAt: str
    updatedAt: str


class ActionIn(BaseModel):
    action: str  # 'approve' | 'revision' | 'decline'
    tier: Optional[str] = None
    payload: Dict[str, Any] = Field(default_factory=dict)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
SLUG_RX = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def _ensure_slug(slug: str) -> str:
    slug = (slug or "").strip().lower()
    if not slug or not SLUG_RX.match(slug):
        raise HTTPException(status_code=400, detail="Invalid slug — use lowercase letters, numbers and hyphens")
    return slug


def _doc_to_out(doc: dict) -> dict:
    doc = dict(doc)
    doc.pop("_id", None)
    return doc


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


# ---------------------------------------------------------------------------
# Routes — health + auth
# ---------------------------------------------------------------------------
@api.get("/")
async def root():
    return {"service": "rhys-morgan-backend", "ok": True}


@api.post("/auth/login", response_model=TokenOut)
async def login(body: LoginIn):
    if not ADMIN_PASSWORD or not JWT_SECRET:
        raise HTTPException(status_code=500, detail="Server is not configured")
    if not hmac.compare_digest(body.password or "", ADMIN_PASSWORD):
        raise HTTPException(status_code=401, detail="Incorrect password")
    return TokenOut(token=create_token(), expires_in_hours=JWT_TTL_HOURS)


@api.get("/auth/me")
async def me(_: dict = Depends(require_admin)):
    return {"role": "admin"}


# ---------------------------------------------------------------------------
# Routes — proposals
# ---------------------------------------------------------------------------
@api.get("/proposals", response_model=List[ProposalOut])
async def list_proposals(_: dict = Depends(require_admin)):
    docs = await proposals_col.find().sort("updatedAt", -1).to_list(500)
    return [_doc_to_out(d) for d in docs]


@api.get("/proposals/{slug}", response_model=ProposalOut)
async def get_proposal(slug: str):
    """Public read-by-slug. Returns the proposal regardless of status
    (URLs are unlisted, so access is by slug-knowledge)."""
    slug = _ensure_slug(slug)
    doc = await proposals_col.find_one({"slug": slug})
    if not doc:
        raise HTTPException(status_code=404, detail="Proposal not found")
    return _doc_to_out(doc)


@api.post("/proposals", response_model=ProposalOut, status_code=201)
async def create_proposal(body: ProposalIn, _: dict = Depends(require_admin)):
    slug = _ensure_slug(body.slug)
    existing = await proposals_col.find_one({"slug": slug})
    if existing:
        raise HTTPException(status_code=409, detail="A proposal with that slug already exists")
    doc = body.model_dump()
    doc["slug"] = slug
    doc["id"] = str(uuid.uuid4())
    doc["createdAt"] = _now()
    doc["updatedAt"] = doc["createdAt"]
    await proposals_col.insert_one(doc)
    return _doc_to_out(doc)


@api.put("/proposals/{proposal_id}", response_model=ProposalOut)
async def update_proposal(
    proposal_id: str, body: ProposalIn, _: dict = Depends(require_admin)
):
    existing = await proposals_col.find_one({"id": proposal_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Proposal not found")
    new_slug = _ensure_slug(body.slug)
    # Reject slug collisions with a different proposal
    other = await proposals_col.find_one({"slug": new_slug, "id": {"$ne": proposal_id}})
    if other:
        raise HTTPException(status_code=409, detail="Another proposal already uses that slug")
    update_doc = body.model_dump()
    update_doc["slug"] = new_slug
    update_doc["updatedAt"] = _now()
    await proposals_col.update_one({"id": proposal_id}, {"$set": update_doc})
    final = await proposals_col.find_one({"id": proposal_id})
    return _doc_to_out(final)


@api.delete("/proposals/{proposal_id}", status_code=204)
async def delete_proposal(proposal_id: str, _: dict = Depends(require_admin)):
    result = await proposals_col.delete_one({"id": proposal_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Proposal not found")
    return JSONResponse(status_code=204, content=None)


# ---------------------------------------------------------------------------
# Routes — proposal actions (approve / revision / decline)
# ---------------------------------------------------------------------------
@api.post("/proposals/{slug}/action")
async def record_action(slug: str, body: ActionIn, request: Request):
    slug = _ensure_slug(slug)
    proposal = await proposals_col.find_one({"slug": slug})
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    if body.action not in {"approve", "revision", "decline"}:
        raise HTTPException(status_code=400, detail="Invalid action")
    record = {
        "id": str(uuid.uuid4()),
        "slug": slug,
        "client": proposal.get("client"),
        "action": body.action,
        "tier": body.tier,
        "payload": body.payload,
        "ip": request.client.host if request.client else None,
        "userAgent": request.headers.get("user-agent"),
        "read": False,
        "actedAt": _now(),
    }
    await actions_col.insert_one(record)
    record.pop("_id", None)
    return {"ok": True, "id": record["id"]}


@api.get("/proposal-actions")
async def list_actions(_: dict = Depends(require_admin)):
    docs = await actions_col.find().sort("actedAt", -1).to_list(500)
    return [_doc_to_out(d) for d in docs]


@api.post("/proposal-actions/{action_id}/read")
async def mark_action_read(action_id: str, _: dict = Depends(require_admin)):
    await actions_col.update_one({"id": action_id}, {"$set": {"read": True}})
    return {"ok": True}


@api.get("/proposal-actions/unread-count")
async def unread_count(_: dict = Depends(require_admin)):
    count = await actions_col.count_documents({"read": False})
    return {"count": count}


# ---------------------------------------------------------------------------
# Routes — contact form
# ---------------------------------------------------------------------------
class ContactIn(BaseModel):
    name: str
    email: str
    message: str


@api.post("/contact")
async def submit_contact(body: ContactIn, request: Request):
    record = {
        "id": str(uuid.uuid4()),
        "name": body.name.strip(),
        "email": body.email.strip(),
        "message": body.message.strip(),
        "ip": request.client.host if request.client else None,
        "userAgent": request.headers.get("user-agent"),
        "read": False,
        "submittedAt": _now(),
    }
    if not record["name"] or not record["email"] or not record["message"]:
        raise HTTPException(status_code=400, detail="Missing required fields")
    await contact_col.insert_one(record)
    record.pop("_id", None)
    return {"ok": True, "id": record["id"]}


@api.get("/contact-submissions")
async def list_contacts(_: dict = Depends(require_admin)):
    docs = await contact_col.find().sort("submittedAt", -1).to_list(500)
    return [_doc_to_out(d) for d in docs]


# ---------------------------------------------------------------------------
# Routes — site content (homepage CMS)
# ---------------------------------------------------------------------------
class HeroContent(BaseModel):
    headlineLines: List[str] = Field(default_factory=lambda: ["", "", ""])
    subcopy: str = ""


class AboutContent(BaseModel):
    heading: str = ""
    headingAccent: str = ""
    body: List[str] = Field(default_factory=lambda: ["", ""])


class ServiceContent(BaseModel):
    title: str = ""
    description: str = ""


class ProcessContent(BaseModel):
    title: str = ""
    body: str = ""


class ContactContent(BaseModel):
    email: str = ""
    whatsapp: str = ""
    whatsappDisplay: str = ""


class SiteContentModel(BaseModel):
    hero: HeroContent = Field(default_factory=HeroContent)
    about: AboutContent = Field(default_factory=AboutContent)
    services: List[ServiceContent] = Field(default_factory=list)
    process: List[ProcessContent] = Field(default_factory=list)
    contact: ContactContent = Field(default_factory=ContactContent)


SITE_CONTENT_KEY = "default"

SITE_CONTENT_DEFAULTS: dict = {
    "key": SITE_CONTENT_KEY,
    "hero": {
        "headlineLines": ["Where strategy", "meets", "craft."],
        "subcopy": "Elevating brands through digital-led marketing, creative strategy, and professional branding services.",
    },
    "about": {
        "heading": "Agency-level expertise.",
        "headingAccent": "Without the agency overhead.",
        "body": [
            "With over 15 years in the creative industry, I bring the strategic weight of a Creative Director to the agility of a freelance partnership. Having led creative for iconic names like Disney, Team GB, and National Grid, I now specialise in bridging the gap between high-level brand strategy and local business growth.",
            "My approach is straightforward: agency-level expertise without the agency overhead — giving you direct access to a creative all-rounder who prioritises speed, precision, and results.",
        ],
    },
    "services": [
        {"title": "Brand Identity",     "description": "Logos, wordmarks, systems and guidelines — built to hold up across decades, not just launch week."},
        {"title": "Web Design & Build", "description": "Considered, fast websites that feel like editorial — for brands where first impression is everything."},
        {"title": "Creative Direction", "description": "I act as an embedded partner for campaigns, launches and rebrands — one hand on the vision throughout."},
        {"title": "Content & Campaigns","description": "Social media assets, email marketing, and print/editorial design — built as a system, not one-offs."},
    ],
    "process": [
        {"title": "Discover", "body": "I dive deep into your brief to understand your vision, audience, and market landscape."},
        {"title": "Define",   "body": "Strategic analysis meets creative concepting to map out a clear, impactful path forward."},
        {"title": "Deliver",  "body": "From final branding to digital assets, I produce and publish high-quality work ready for the live market."},
        {"title": "Develop",  "body": "I provide post-launch support and monthly growth retainers, using real-world data and analytics to refine, optimise, and ensure your long-term success."},
    ],
    "contact": {
        "email": "hello@rhysmorgan.studio",
        "whatsapp": "+447930577757",
        "whatsappDisplay": "07930 577 757",
    },
}


@api.get("/site-content")
async def get_site_content():
    """Public read of the homepage content."""
    doc = await site_content_col.find_one({"key": SITE_CONTENT_KEY})
    if not doc:
        # Seed and return defaults if missing (defensive)
        doc = dict(SITE_CONTENT_DEFAULTS)
        doc["updatedAt"] = _now()
        await site_content_col.insert_one(doc)
    return _doc_to_out(doc)


@api.put("/site-content")
async def update_site_content(body: SiteContentModel, _: dict = Depends(require_admin)):
    update_doc = body.model_dump()
    update_doc["key"] = SITE_CONTENT_KEY
    update_doc["updatedAt"] = _now()
    await site_content_col.update_one(
        {"key": SITE_CONTENT_KEY},
        {"$set": update_doc, "$setOnInsert": {"createdAt": _now()}},
        upsert=True,
    )
    final = await site_content_col.find_one({"key": SITE_CONTENT_KEY})
    return _doc_to_out(final)


# ---------------------------------------------------------------------------
# Routes — uploads
# ---------------------------------------------------------------------------
@api.post("/uploads")
async def upload_file(
    file: UploadFile = File(...), _: dict = Depends(require_admin)
):
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_IMAGE_EXT:
        raise HTTPException(status_code=400, detail="Only image files allowed (.jpg, .png, .webp, .gif)")
    data = await file.read()
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="File too large (max 8MB)")
    name = f"{uuid.uuid4().hex}{ext}"
    target = UPLOAD_DIR / name
    target.write_bytes(data)
    return {"filename": name, "path": f"/api/uploads/{name}"}


@api.get("/uploads/{filename}")
async def serve_upload(filename: str):
    safe = Path(filename).name  # prevent path traversal
    target = UPLOAD_DIR / safe
    if not target.exists() or not target.is_file():
        raise HTTPException(status_code=404, detail="Not found")
    return FileResponse(target)


# ---------------------------------------------------------------------------
# Seed — first-time bootstrap of the gold-standard hobby-horse record
# ---------------------------------------------------------------------------
SEED_HOBBY_HORSE: dict = {
    "id": "seed-hobby-horse",
    "slug": "hobby-horse",
    "status": "draft",
    "client": "The Hobby Horse",
    "projectTitle": "Digital Brand & Web Elevation for The Hobby Horse",
    "preparedFor": "Harriet Ashworth, Founder",
    "preparedBy": "Rhys Morgan, Creative Marketing",
    "preparedDate": None,
    "validUntil": None,
    "reference": "RM-2025-048",
    "coverImage": "https://images.unsplash.com/photo-1714733340805-268e89cf861a?crop=entropy&cs=srgb&fm=jpg&q=85",
    "intro": (
        "A focused proposal to elevate The Hobby Horse from a respected local name into a "
        "destination digital brand. Three coordinated workstreams — a full digital rebrand, a "
        "bespoke website build, and a local SEO strategy — designed to win the next 12 months "
        "of bookings, walk-ins and reputation."
    ),
    "scope": {
        "summary": "Full digital rebrand, bespoke website build, and local SEO strategy.",
        "goals": [
            "Reposition the brand for a wider, destination-led audience without losing the loyal local following.",
            "Replace the existing site with a fast, bespoke, booking-first build that converts on mobile.",
            "Own the local search results for \"gastropub\", \"Sunday roast\" and bookable terms within 90 days of launch.",
        ],
        "deliverables": [
            "Brand audit & reposition strategy",
            "Refreshed identity system (digital-first)",
            "Bespoke website design & build",
            "Booking flow & integrations",
            "Local SEO setup & 90-day plan",
            "Photography direction & launch assets",
        ],
        "timeline": [
            {"phase": "Discover", "weeks": "Weeks 1–2",  "body": "Brand audit, customer interviews, competitor and search landscape review."},
            {"phase": "Define",   "weeks": "Weeks 3–5",  "body": "Strategy doc, refined identity direction, site architecture and SEO blueprint."},
            {"phase": "Deliver",  "weeks": "Weeks 6–10", "body": "Design, build, content, photography direction, launch."},
            {"phase": "Develop",  "weeks": "Weeks 11+",  "body": "Local SEO execution, monthly reporting, ongoing creative retainer."},
        ],
    },
    "concepts": [
        {"name": "Idea 01 — The Stable",        "direction": "Warm, candle-lit, confidently local. Rich wood-toned palette, letterpress-inspired wordmark, a hand-drawn horse mark used sparingly as a seal. A neighbourhood favourite from day one.", "image": "https://images.unsplash.com/photo-1714733340805-268e89cf861a?crop=entropy&cs=srgb&fm=jpg&q=85"},
        {"name": "Idea 02 — Saddle & Crown",    "direction": "Heritage-forward with a modern twist. Editorial typography paired with a crest-led mark. Saddle-leather tans, off-whites and deep reds — nodding to coaching inns without feeling costumed.", "image": "https://images.unsplash.com/photo-1757228727900-7758efc55404?crop=entropy&cs=srgb&fm=jpg&q=85"},
        {"name": "Idea 03 — Press & Paper",     "direction": "A system led by print. Letterpress menus, numbered editions, collectable coasters. A quieter, craft-first route that rewards guests who look twice.", "image": "https://images.unsplash.com/photo-1634573595357-de8a4448c573?crop=entropy&cs=srgb&fm=jpg&q=85"},
        {"name": "Idea 04 — Digital First",     "direction": "A confident digital presence out of the gate — booking-led site, signature photography, and a content system that runs without a dedicated agency. Built for growth from week one.", "image": "https://images.unsplash.com/photo-1771923082503-0a3381c46cef?crop=entropy&cs=srgb&fm=jpg&q=85"},
    ],
    "investment": {
        "currency": "£",
        "note": "All tiers include the full 4D Framework (Discover → Develop). Prices exclude VAT and third-party costs (photography, ad spend, third-party booking software).",
        "tiers": [
            {"name": "Essentials", "tag": "Launch-ready",     "price": "6,800",  "cadence": "project",            "summary": "Refreshed digital identity and a bookable single-page site — built to launch fast.", "includes": ["Brand audit & one identity direction","Logo, wordmark & digital toolkit","Single-page bookable website","Google Business Profile setup","30-day post-launch support"], "featured": False},
            {"name": "Growth",     "tag": "Recommended",      "price": "12,400", "cadence": "project",            "summary": "Full rebrand, bespoke website and a 90-day local SEO programme to win the search results.", "includes": ["Strategy + two identity directions","Full digital brand system","Bespoke multi-page website + booking flow","Local SEO setup & 90-day execution plan","Launch campaign (social, email, press)","60-day post-launch support"], "featured": True},
            {"name": "Elite",      "tag": "Full partnership", "price": "22,800", "cadence": "project + retainer", "summary": "Growth tier plus six months of ongoing creative direction, SEO and analytics.", "includes": ["Everything in Growth","Photography direction & shoot","Interior signage & wayfinding","Monthly creative & SEO retainer (6 months)","Analytics, reporting & iteration","Priority access, flexible scope"], "featured": False},
        ],
    },
    "terms": [
        "50% engagement fee on acceptance, balance invoiced at delivery milestones.",
        "Two rounds of feedback included per deliverable; additional time billed at the standard rate of £30/hr.",
        "This proposal is valid for 60 days from the date issued.",
    ],
}


@app.on_event("startup")
async def seed_data():
    """Seed the gold-standard proposal + default site content on first boot."""
    try:
        existing = await proposals_col.find_one({"slug": "hobby-horse"})
        if not existing:
            doc = dict(SEED_HOBBY_HORSE)
            doc["createdAt"] = _now()
            doc["updatedAt"] = doc["createdAt"]
            await proposals_col.insert_one(doc)
            logger.info("Seeded gold-standard proposal: hobby-horse")

        existing_site = await site_content_col.find_one({"key": SITE_CONTENT_KEY})
        if not existing_site:
            doc = dict(SITE_CONTENT_DEFAULTS)
            doc["createdAt"] = _now()
            doc["updatedAt"] = doc["createdAt"]
            await site_content_col.insert_one(doc)
            logger.info("Seeded default site content")
    except Exception as e:  # pragma: no cover
        logger.exception("Seed failed: %s", e)


@app.on_event("shutdown")
async def shutdown_db():  # pragma: no cover
    client.close()


# Register router
app.include_router(api)
