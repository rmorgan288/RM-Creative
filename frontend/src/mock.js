// Mock data for Rhys Morgan Creative Marketing portfolio
// All data here is placeholder - will be replaced by backend API later

export const brand = {
  name: 'Rhys Morgan',
  tagline: 'Creative Marketing',
  shortBio: 'Independent Creative Director & Designer crafting brands that feel unmistakably human.',
  email: 'hello@rhysmorgan.studio',
  whatsapp: '+447930577757',
  whatsappDisplay: '07930 577 757',
  location: 'Based in South Wales — Available worldwide',
  locationShort: 'South Wales, UK',
  since: 2013,
};

export const navigation = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

export const hero = {
  eyebrow: 'Creative Marketing · Brand Strategy · Digital',
  headlineLines: [
    'Where strategy',
    'meets',
    'craft.',
  ],
  subcopy:
    'Elevating brands through digital-led marketing, creative strategy, and professional branding services.',
  stats: [
    { value: '15+', label: 'Years of industry experience' },
    { value: '8', label: 'National & global brands shaped' },
    { value: '4D', label: 'Framework-led process' },
  ],
};

export const featuredProject = {
  id: 'butterflies',
  client: 'Butterflies Bar & Kitchen',
  sector: 'Hospitality · 20-Year Rebrand',
  year: 2025,
  headline: 'Twenty years in. A whole new fire.',
  summary:
    'A full rebrand marking 20 years at the heart of South Wales. The brief was simple: honour the heritage, elevate the experience, and let the speciality steaks take centre stage. The result is a premium identity anchored by a bespoke crest — its symmetry drawn from the butterfly, its soul from the Blaenavon Ironworks. Crafted to carry a gastropub legend into its next chapter.',
  cover:
    'https://customer-assets.emergentagent.com/wingman/821fda20-6b65-4bc0-9677-fe505c145882/attachments/0bf0f89ec0604d7cb0900e7a1a2beb76_Butterflies_hero.jpg',
  gallery: [
    'https://customer-assets.emergentagent.com/wingman/821fda20-6b65-4bc0-9677-fe505c145882/attachments/3137b3634a4347208935fcbdd2652f89_Butterflies1.jpg',
    'https://customer-assets.emergentagent.com/wingman/821fda20-6b65-4bc0-9677-fe505c145882/attachments/827668ae413f4a749d2007f162106e91_Butterflies2.jpg',
  ],
  deliverables: ['Brand Identity', 'Bespoke Crest', 'Menu & Print', 'Signage', 'Digital & Launch'],
  results: [
    { kpi: '20 yrs', label: 'Of South Wales heritage, reframed' },
    { kpi: '+62%', label: 'Weeknight covers in first quarter post-launch' },
    { kpi: '4.9★', label: 'Average guest rating in the launch month' },
  ],
  quote: {
    text: 'Rhys didn’t just refresh a logo — he honoured twenty years of work and gave us a flame to carry into the next twenty.',
    author: 'Naomi Hart',
    role: 'Founder, Butterflies Bar & Kitchen',
  },
};

export const projects = [
  {
    id: 'disney-royal-mint',
    client: 'Disney x The Royal Mint',
    sector: 'Precious Metals · Packaging',
    year: null,
    thumbnail:
      'https://customer-assets.emergentagent.com/wingman/821fda20-6b65-4bc0-9677-fe505c145882/attachments/1518230ac1424c4abd9a4c323cc8903c_Disney and royal mint@3x-50.jpg',
    tags: ['Campaign', 'Packaging', 'Art Direction'],
    blurb:
      'Where royal craftsmanship meets childhood magic. Packaging and campaign work for a limited edition Winnie the Pooh collector coin series designed to stop scrolls, spark nostalgia and sell out fast.',
  },
  {
    id: 'meridian',
    client: 'Meridian Watches',
    sector: 'E-commerce · Digital',
    year: 2023,
    thumbnail:
      'https://images.unsplash.com/photo-1633869699811-cd4f63049b36?crop=entropy&cs=srgb&fm=jpg&q=85',
    tags: ['Web Design', 'Shopify', 'Photography Direction'],
    blurb:
      'A modular storefront for a heritage watchmaker. Designed to feel like a gallery, not a shop.',
  },
  {
    id: 'northfield',
    client: 'Northfield Studios',
    sector: 'Architecture · Website',
    year: 2023,
    thumbnail:
      'https://images.unsplash.com/photo-1552925766-63ab07391e02?crop=entropy&cs=srgb&fm=jpg&q=85',
    tags: ['Art Direction', 'Website', 'Editorial'],
    blurb:
      'An architecture studio with 40 years of work. A website that lets the buildings breathe.',
  },
  {
    id: 'volta',
    client: 'Volta Coffee',
    sector: 'F&B · Packaging',
    year: 2022,
    thumbnail:
      'https://images.unsplash.com/photo-1761936513644-cbc5f3207139?crop=entropy&cs=srgb&fm=jpg&q=85',
    tags: ['Packaging', 'Identity', 'Copywriting'],
    blurb:
      'Single-origin coffee for people who read the label. Charcoal matte, foil-stamped, unmistakable.',
  },
];

export const services = [
  {
    number: '01',
    title: 'Brand Identity',
    description:
      'Logos, wordmarks, systems and guidelines — built to hold up across decades, not just launch week.',
    deliverables: ['Strategy & naming', 'Visual identity', 'Guidelines', 'Art direction'],
  },
  {
    number: '02',
    title: 'Web Design & Build',
    description:
      'Considered, fast websites that feel like editorial — for brands where first impression is everything.',
    deliverables: ['UX & wireframes', 'UI design', 'Development handoff', 'CMS setup'],
  },
  {
    number: '03',
    title: 'Creative Direction',
    description:
      'I act as an embedded partner for campaigns, launches and rebrands — one hand on the vision throughout.',
    deliverables: ['Campaign concepts', 'Photography direction', 'Messaging', 'Launch planning'],
  },
  {
    number: '04',
    title: 'Content & Campaigns',
    description:
      'Social media assets, email marketing, and print/editorial design — built as a system, not one-offs.',
    deliverables: ['Social content systems', 'Email & newsletters', 'Editorial & print', 'Campaign rollout'],
  },
];

export const retainer = {
  number: '05',
  label: 'Ongoing Partnership',
  title: 'Monthly Growth & Strategy Retainers',
  description:
    'For brands ready to compound results month over month. I work alongside your team as an embedded creative partner — combining ongoing creative direction, strategy, and analytics so the work keeps moving, refining, and earning attention long after launch.',
  inclusions: [
    'Monthly strategy & planning sessions',
    'Continuous creative direction',
    'Analytics, reporting & iteration',
    'Priority access & flexible scope',
  ],
  cta: 'Enquire about retainers',
};

export const testimonials = [
  {
    quote:
      'The rarest kind of designer — strategic, quietly obsessive, and genuinely fun to have in a room.',
    author: 'Daniel Okafor',
    role: 'CEO, Meridian Watches',
  },
  {
    quote:
      'Rhys treated our studio like his own. Three months in, the phone wouldn’t stop ringing.',
    author: 'Eleanor Voss',
    role: 'Partner, Northfield Studios',
  },
  {
    quote:
      'He understood Aurora better than we did. The brand feels like us — just the version we’d been trying to articulate.',
    author: 'Mira Chen',
    role: 'Founder, Aurora Skin Co.',
  },
];

export const about = {
  eyebrow: 'About — Independent Creative Director',
  heading: 'Agency-level expertise.',
  headingAccent: 'Without the agency overhead.',
  body: [
    'With over 15 years in the creative industry, I bring the strategic weight of a Creative Director to the agility of a freelance partnership. Having led creative for iconic names like Disney, Team GB, and National Grid, I now specialise in bridging the gap between high-level brand strategy and local business growth.',
    'My approach is straightforward: agency-level expertise without the agency overhead — giving you direct access to a creative all-rounder who prioritises speed, precision, and results.',
  ],
};

export const processSteps = [
  {
    step: '01',
    title: 'Discover',
    body: 'I dive deep into your brief to understand your vision, audience, and market landscape.',
  },
  {
    step: '02',
    title: 'Define',
    body: 'Strategic analysis meets creative concepting to map out a clear, impactful path forward.',
  },
  {
    step: '03',
    title: 'Deliver',
    body: 'From final branding to digital assets, I produce and publish high-quality work ready for the live market.',
  },
  {
    step: '04',
    title: 'Develop',
    body: 'I provide post-launch support and monthly growth retainers, using real-world data and analytics to refine, optimise, and ensure your long-term success.',
  },
];

export const clientsList = [
  'Disney',
  'Team GB',
  'The Royal Mint',
  'National Grid',
  'e.on',
  'Butterflies Bar & Kitchen',
  'St Albans City FC',
  'Marie Curie',
];

// Mock contact form submission - logs to console + saves to localStorage
export const submitContactMock = (payload) => {
  const existing = JSON.parse(localStorage.getItem('rm_contact_submissions') || '[]');
  const record = { ...payload, id: Date.now().toString(), submittedAt: new Date().toISOString() };
  existing.push(record);
  localStorage.setItem('rm_contact_submissions', JSON.stringify(existing));
  return new Promise((resolve) => setTimeout(() => resolve({ ok: true, id: record.id }), 700));
};

// -----------------------------
// CLIENT PROPOSALS (hidden template pages)
// Keyed by slug: /proposals/:slug
// -----------------------------
export const proposals = {
  'hobby-horse': {
    slug: 'hobby-horse',
    status: 'DRAFT',
    client: 'The Hobby Horse',
    projectTitle: 'Digital Brand & Web Elevation for The Hobby Horse',
    preparedFor: 'Harriet Ashworth, Founder',
    preparedBy: 'Rhys Morgan, Creative Marketing',
    // preparedDate and validUntil are intentionally omitted — the component
    // auto-computes the current month/year and a +60-day expiry.
    preparedDate: null,
    validUntil: null,
    reference: 'RM-2025-048',
    coverImage:
      'https://images.unsplash.com/photo-1714733340805-268e89cf861a?crop=entropy&cs=srgb&fm=jpg&q=85',
    intro:
      'A focused proposal to elevate The Hobby Horse from a respected local name into a destination digital brand. Three coordinated workstreams — a full digital rebrand, a bespoke website build, and a local SEO strategy — designed to win the next 12 months of bookings, walk-ins and reputation.',
    scope: {
      summary:
        'Full digital rebrand, bespoke website build, and local SEO strategy.',
      goals: [
        'Reposition the brand for a wider, destination-led audience without losing the loyal local following.',
        'Replace the existing site with a fast, bespoke, booking-first build that converts on mobile.',
        'Own the local search results for "gastropub", "Sunday roast" and bookable terms within 90 days of launch.',
      ],
      deliverables: [
        'Brand audit & reposition strategy',
        'Refreshed identity system (digital-first)',
        'Bespoke website design & build',
        'Booking flow & integrations',
        'Local SEO setup & 90-day plan',
        'Photography direction & launch assets',
      ],
      timeline: [
        { phase: 'Discover', weeks: 'Weeks 1–2', body: 'Brand audit, customer interviews, competitor and search landscape review.' },
        { phase: 'Define',   weeks: 'Weeks 3–5', body: 'Strategy doc, refined identity direction, site architecture and SEO blueprint.' },
        { phase: 'Deliver',  weeks: 'Weeks 6–10', body: 'Design, build, content, photography direction, launch.' },
        { phase: 'Develop',  weeks: 'Weeks 11+',  body: 'Local SEO execution, monthly reporting, ongoing creative retainer.' },
      ],
    },
    concepts: [
      {
        name: 'Idea 01 — The Stable',
        direction: 'Warm, candle-lit, confidently local. Rich wood-toned palette, letterpress-inspired wordmark, a hand-drawn horse mark used sparingly as a seal. A neighbourhood favourite from day one.',
        image:
          'https://images.unsplash.com/photo-1714733340805-268e89cf861a?crop=entropy&cs=srgb&fm=jpg&q=85',
      },
      {
        name: 'Idea 02 — Saddle & Crown',
        direction: 'Heritage-forward with a modern twist. Editorial typography paired with a crest-led mark. Saddle-leather tans, off-whites and deep reds — nodding to coaching inns without feeling costumed.',
        image:
          'https://images.unsplash.com/photo-1757228727900-7758efc55404?crop=entropy&cs=srgb&fm=jpg&q=85',
      },
      {
        name: 'Idea 03 — Press & Paper',
        direction: 'A system led by print. Letterpress menus, numbered editions, collectable coasters. A quieter, craft-first route that rewards guests who look twice.',
        image:
          'https://images.unsplash.com/photo-1634573595357-de8a4448c573?crop=entropy&cs=srgb&fm=jpg&q=85',
      },
      {
        name: 'Idea 04 — Digital First',
        direction: 'A confident digital presence out of the gate — booking-led site, signature photography, and a content system that runs without a dedicated agency. Built for growth from week one.',
        image:
          'https://images.unsplash.com/photo-1771923082503-0a3381c46cef?crop=entropy&cs=srgb&fm=jpg&q=85',
      },
    ],
    investment: {
      currency: '£',
      note: 'All tiers include the full 4D Framework (Discover → Develop). Prices exclude VAT and third-party costs (photography, ad spend, third-party booking software).',
      tiers: [
        {
          name: 'Essentials',
          tag: 'Launch-ready',
          price: '6,800',
          cadence: 'project',
          summary: 'Refreshed digital identity and a bookable single-page site — built to launch fast.',
          includes: [
            'Brand audit & one identity direction',
            'Logo, wordmark & digital toolkit',
            'Single-page bookable website',
            'Google Business Profile setup',
            '30-day post-launch support',
          ],
          featured: false,
        },
        {
          name: 'Growth',
          tag: 'Recommended',
          price: '12,400',
          cadence: 'project',
          summary: 'Full rebrand, bespoke website and a 90-day local SEO programme to win the search results.',
          includes: [
            'Strategy + two identity directions',
            'Full digital brand system',
            'Bespoke multi-page website + booking flow',
            'Local SEO setup & 90-day execution plan',
            'Launch campaign (social, email, press)',
            '60-day post-launch support',
          ],
          featured: true,
        },
        {
          name: 'Elite',
          tag: 'Full partnership',
          price: '22,800',
          cadence: 'project + retainer',
          summary: 'Growth tier plus six months of ongoing creative direction, SEO and analytics.',
          includes: [
            'Everything in Growth',
            'Photography direction & shoot',
            'Interior signage & wayfinding',
            'Monthly creative & SEO retainer (6 months)',
            'Analytics, reporting & iteration',
            'Priority access, flexible scope',
          ],
          featured: false,
        },
      ],
    },
    terms: [
      '50% engagement fee on acceptance, balance invoiced at delivery milestones.',
      'Two rounds of feedback included per deliverable; additional time billed at the standard rate of £30/hr.',
      'This proposal is valid for 60 days from the date issued.',
    ],
  },
};

// Backwards-compatibility — old preview link still works
proposals['the-hobby-horse'] = proposals['hobby-horse'];

// Live date helpers — proposal preparedDate / validUntil auto-fill to "now" if not set
export const formatProposalDate = (date = new Date()) =>
  date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

export const formatValidUntil = (days = 60, base = new Date()) => {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

export const getProposal = (slug) => proposals[slug] || null;

// Unified proposal action recorder. action = 'approve' | 'revision' | 'decline'
export const recordProposalActionMock = ({ slug, action, tier = null, payload = {} }) => {
  const record = {
    slug,
    action,
    tier,
    payload,
    actedAt: new Date().toISOString(),
  };
  const existing = JSON.parse(localStorage.getItem('rm_proposal_actions') || '[]');
  existing.push(record);
  localStorage.setItem('rm_proposal_actions', JSON.stringify(existing));
  return new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 600));
};

// Legacy shim
export const acceptProposalMock = (slug, tierName) =>
  recordProposalActionMock({ slug, action: 'approve', tier: tierName });
