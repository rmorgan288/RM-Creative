# Rhys Morgan — Freelance Designer Portfolio (PRD)

## Original Problem Statement
Build a professional portfolio website for a freelance Graphic/Web Designer and Creative Director (Rhys Morgan). Dark luxury aesthetic (deep charcoal background, red accent `#e3494e`), portfolio gallery, contact form, a hidden dynamic client proposal template at `/proposals/:slug`, and a password-protected admin dashboard at `/admin` to manage proposals + live homepage content.

User language: **English (UK)** — maintain UK spelling.

## Architecture
- **Frontend**: React + Tailwind + shadcn/ui, `canvas-confetti`, `@firecms/neat` (WebGL hero), `react-helmet-async` (per-route SEO)
- **Backend**: FastAPI + Motor + PyJWT
- **DB**: `proposals`, `site_content`

## Implemented
- Hero, About, Services, Contact, Header, Footer, FeaturedCase, ProjectGrid
- Admin login at `/login`, JWT-protected `/admin`, Proposal Manager + Site Content editor
- Hidden `/proposals/:slug` with 3-button approval flow + confetti
- Case studies: Disney x Royal Mint, SportTape, Feel Good Drinks, Personal Illustration, Butterflies Steakhouse, **60 Gracechurch Street**, **RAF 100th Anniversary £2 Coin** [2026-02]
- WebGL `NeatGradient` background in Hero with mask-fade to next section + NEAT watermark CSS-hidden [2026-02]
- **[2026-02] Full SEO/AIO/GEO pass**:
  - `<SEO />` component (react-helmet-async) — per-route titles, descriptions, OG, Twitter cards, JSON-LD
  - Homepage emits Person + LocalBusiness + WebSite schema (South Wales, notable clients: Disney, Team GB, Royal Mint)
  - Same JSON-LD also embedded in `public/index.html` for non-JS-executing AI crawlers
  - `/login`, `/admin`, `/proposals/:slug` → `noindex, nofollow`
  - `public/robots.txt` (allows GPTBot, PerplexityBot, ClaudeBot, Google-Extended; blocks /admin, /login, /proposals/)
  - `public/sitemap.xml` (homepage with `lastmod=2026-02-06`)
  - Semantic HTML polish (marquee as `<aside>` with sr-only list)

## Credentials
- Admin route: `/login`
- Password: `BrunelHouse0301!`

## Backlog / Future
- Update `https://rhysmorgan.studio/` placeholder in sitemap.xml + robots.txt to actual production domain
- Case study deep-dive pages
- Blog/journal section
- (Optional) NEAT commercial licence
- (Suggested) "Filter by service" pill bar on Selected Work grid
- (Suggested) Featured tile variant in ProjectGrid

## Key API endpoints
- `POST /api/login`
- `GET/POST /api/proposals`, `GET /api/proposals/{slug}`
- `GET/PUT /api/site-content`

## Notes for next agent
- Always `yarn add` for FE deps (not npm)
- Restart frontend supervisor when editing `public/index.html` (dev server only watches `src/`)
- UK English throughout
- All routes wrapped in `<HelmetProvider>` at `App.js`
