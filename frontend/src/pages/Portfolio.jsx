import React, { useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import FeaturedCase from '../components/FeaturedCase';
import ProjectGrid from '../components/ProjectGrid';
import About from '../components/About';
import Services from '../components/Services';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

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
