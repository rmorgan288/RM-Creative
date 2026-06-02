# Rhys Morgan — Freelance Designer Portfolio (PRD)

## Original Problem Statement
Build a professional portfolio website for a freelance Graphic/Web Designer and Creative Director (Rhys Morgan). Dark luxury aesthetic (deep charcoal background, red accent `#e3494e`), portfolio gallery, contact form, a hidden dynamic client proposal template at `/proposals/:slug`, and a password-protected admin dashboard at `/admin` to manage proposals + live homepage content.

User language: **English (UK)** — maintain UK spelling (specialise, optimise, honour, centre) throughout.

## Architecture
- **Frontend**: React + Tailwind + shadcn/ui, `canvas-confetti`, `@firecms/neat` (WebGL hero background)
- **Backend**: FastAPI + Motor (async MongoDB), PyJWT auth
- **DB collections**:
  - `proposals` — `{slug, clientName, projectTitle, status, coverImage, scope, ideas, tiers, terms}`
  - `site_content` — `{key:"default", hero, about, services, process, contact}`

## Implemented
- Hero, About, Services, Contact, Header, Footer, FeaturedCase, ProjectGrid (dark luxury aesthetic)
- Admin login at `/login` (hidden from nav), JWT-protected `/admin`
- Proposals manager + dynamic `/proposals/:slug` with 3-button approval flow + confetti
- Site Content editor (`/admin/site-content`) for live homepage edits
- Case studies updated (Disney x Royal Mint, SportTape, Feel Good Drinks, Personal Illustration, Butterflies Steakhouse)
- Crisper 35mm film grain background
- **[2026-02] WebGL animated `NeatGradient` background in Hero** (replaces static red bloom; deep red palette with chromatic aberration + fresnel + vignette per user-supplied config; scroll-linked yOffset)

## Credentials
- Admin route: `/login`
- Password: `BrunelHouse0301!`

## Backlog / Future
- None pending from user. Possible enhancements: case study deep-dive pages, blog/journal, dark/light toggle, SEO/OG metadata polish.

## Key API endpoints
- `POST /api/login`
- `GET /api/proposals`, `POST /api/proposals`, `GET /api/proposals/{slug}`
- `GET /api/site-content`, `PUT /api/site-content`

## Notes for next agent
- Always use `yarn add` for FE packages (not npm).
- Respect UK English in all user-facing copy.
- `NeatGradient` lives in `/app/frontend/src/components/Hero.jsx` — config object inlined at top of file.
