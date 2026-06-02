import React, { useEffect } from 'react';
import SEO from '../components/SEO';
import Header from '../components/Header';
import Hero from '../components/Hero';
import FeaturedCase from '../components/FeaturedCase';
import ProjectGrid from '../components/ProjectGrid';
import About from '../components/About';
import Services from '../components/Services';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const LOGO_URL =
  'https://customer-assets.emergentagent.com/wingman/821fda20-6b65-4bc0-9677-fe505c145882/attachments/9468c975faec4774af2c1d56b4fe990d_RM_Logo-Mark_Red.png';

const SITE_ORIGIN =
  typeof window !== 'undefined' && window.location?.origin
    ? window.location.origin
    : 'https://rhysmorgan.studio';

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Rhys Morgan',
  jobTitle: 'Creative Director',
  description:
    'Freelance Creative Director and brand strategist specialising in brand identity, web design and marketing services for ambitious teams.',
  url: SITE_ORIGIN,
  image: LOGO_URL,
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'South Wales',
    addressCountry: 'GB',
  },
  worksFor: {
    '@type': 'Organization',
    name: 'Rhys Morgan Creative',
  },
  knowsAbout: [
    'Brand Identity',
    'Brand Strategy',
    'Creative Direction',
    'Web Design',
    'Marketing Services',
    'Art Direction',
    'Coin Design',
  ],
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_ORIGIN}/#business`,
  name: 'Rhys Morgan Creative',
  description:
    'Independent creative studio led by Rhys Morgan, offering brand identity, web design and marketing services from South Wales for clients across the UK and beyond.',
  url: SITE_ORIGIN,
  image: LOGO_URL,
  logo: LOGO_URL,
  priceRange: '££££',
  founder: {
    '@type': 'Person',
    name: 'Rhys Morgan',
  },
  areaServed: [
    { '@type': 'Place', name: 'South Wales' },
    { '@type': 'Place', name: 'United Kingdom' },
    { '@type': 'Place', name: 'London' },
  ],
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'South Wales',
    addressCountry: 'GB',
  },
  knowsAbout: [
    'Brand Identity',
    'Brand Strategy',
    'Creative Direction',
    'Web Design',
    'Marketing Services',
  ],
  makesOffer: [
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Brand Identity' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Web Design & Build' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Creative Direction' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Content & Campaigns' } },
  ],
  // Notable client work — surfaced for AI search/GEO
  subjectOf: [
    { '@type': 'CreativeWork', name: 'Disney x The Royal Mint — Winnie the Pooh Collector Coin' },
    { '@type': 'CreativeWork', name: 'RAF 100th Anniversary £2 Coin — The Royal Mint' },
    { '@type': 'CreativeWork', name: '60 Gracechurch Street — City of London Property Branding' },
    { '@type': 'CreativeWork', name: 'Team GB — Campaign Work' },
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Rhys Morgan — Creative Marketing',
  url: SITE_ORIGIN,
  inLanguage: 'en-GB',
  publisher: { '@type': 'Person', name: 'Rhys Morgan' },
};

const homepageJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [personSchema, localBusinessSchema, websiteSchema],
};

const Portfolio = () => {
  // Simple scroll reveal for .fade-in elements
  useEffect(() => {
    const els = document.querySelectorAll('.fade-in');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="relative grain">
      <SEO
        title="Rhys Morgan — Creative Director, South Wales | Brand & Web"
        description="Rhys Morgan is a freelance Creative Director in South Wales. Brand strategy, identity, web design and marketing services for ambitious teams — Disney, Team GB, The Royal Mint."
        path="/"
        jsonLd={homepageJsonLd}
      />
      <Header />
      <main>
        <Hero />
        <FeaturedCase />
        <ProjectGrid />
        <About />
        <Services />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;
