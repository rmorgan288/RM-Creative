// Mock data for Rhys Morgan Creative Marketing portfolio
// All data here is placeholder - will be replaced by backend API later

export const brand = {
  name: 'Rhys Morgan',
  tagline: 'Creative Marketing',
  shortBio: 'Independent Creative Director & Designer crafting brands that feel unmistakably human.',
  email: 'hello@rhysmorgan.studio',
  whatsapp: '+447700900123',
  whatsappDisplay: '+44 7700 900123',
  location: 'London — Available worldwide',
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
    { value: '12+', label: 'Years directing brands' },
    { value: '80+', label: 'Projects shipped' },
    { value: '4', label: 'D&AD / Brand Awards' },
  ],
};

export const featuredProject = {
  id: 'butterflies',
  client: 'Butterflies Bar & Kitchen',
  sector: 'Hospitality · Full Brand System',
  year: 2024,
  headline: 'A late-night kitchen dressed for the front row.',
  summary:
    'A ground-up identity, menu system, signage and digital presence for a new Soho neighbourhood bar. We translated the idea of “slow evenings” into a warm, charcoal-toned brand with hand-drawn marks and a confident voice.',
  cover:
    'https://images.unsplash.com/photo-1767745455688-49391131f751?crop=entropy&cs=srgb&fm=jpg&q=85',
  gallery: [
    'https://images.unsplash.com/photo-1767022724924-993b00fc04b3?crop=entropy&cs=srgb&fm=jpg&q=85',
    'https://images.unsplash.com/photo-1774921677082-1e29b476472e?crop=entropy&cs=srgb&fm=jpg&q=85',
  ],
  deliverables: ['Brand Identity', 'Menu & Print', 'Website', 'Signage', 'Launch Campaign'],
  results: [
    { kpi: '+62%', label: 'Weeknight covers in first quarter' },
    { kpi: '4.9★', label: 'Average guest rating, launch month' },
    { kpi: '28k', label: 'Organic followers earned in 90 days' },
  ],
  quote: {
    text: 'Rhys didn’t just design us a logo — he directed the feeling of the place before we ever opened the doors.',
    author: 'Naomi Hart',
    role: 'Founder, Butterflies Bar & Kitchen',
  },
};

export const projects = [
  {
    id: 'aurora',
    client: 'Aurora Skin Co.',
    sector: 'Beauty · Brand Identity',
    year: 2024,
    thumbnail:
      'https://images.unsplash.com/photo-1759794108525-94ff060da692?crop=entropy&cs=srgb&fm=jpg&q=85',
    tags: ['Identity', 'Packaging', 'Art Direction'],
    blurb:
      'A quiet, clinical beauty brand with a cult following. Built around ritual, not noise.',
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
      'Acting as an embedded partner for campaigns, launches and rebrands. One hand on the vision.',
    deliverables: ['Campaign concepts', 'Photography direction', 'Messaging', 'Launch planning'],
  },
  {
    number: '04',
    title: 'Print & Editorial',
    description:
      'Menus, lookbooks, magazines and packaging. Tangible work, held in the hand, not just the feed.',
    deliverables: ['Editorial design', 'Packaging', 'Print production', 'Signage'],
  },
];

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

export const processSteps = [
  { step: '01', title: 'Listen', body: 'A proper conversation. No briefs-by-email, no templated discovery.' },
  { step: '02', title: 'Frame', body: 'A written point of view on what the brand should become — before a pixel is moved.' },
  { step: '03', title: 'Design', body: 'Tight loops, few rounds, clear rationale. You’ll always know why.' },
  { step: '04', title: 'Ship', body: 'Hands-on through launch and the first 90 days. Brands live or die in the details.' },
];

export const clientsList = [
  'Butterflies', 'Aurora Skin Co.', 'Meridian', 'Northfield', 'Volta', 'Hart & Finch', 'Oslo Press', 'Ember Hotels',
];

// Mock contact form submission - logs to console + saves to localStorage
export const submitContactMock = (payload) => {
  const existing = JSON.parse(localStorage.getItem('rm_contact_submissions') || '[]');
  const record = { ...payload, id: Date.now().toString(), submittedAt: new Date().toISOString() };
  existing.push(record);
  localStorage.setItem('rm_contact_submissions', JSON.stringify(existing));
  return new Promise((resolve) => setTimeout(() => resolve({ ok: true, id: record.id }), 700));
};
