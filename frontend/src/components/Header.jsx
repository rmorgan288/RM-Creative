import React, { useEffect, useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { brand, navigation } from '../mock';
import { Button } from './ui/button';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0f0f0f]/85 backdrop-blur-md border-b border-[#1f1f1f]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between h-20">
        {/* Logo mark */}
        <button
          onClick={() => scrollTo('#top')}
          className="flex items-center gap-3 group"
          aria-label="Rhys Morgan \u2014 Creative Marketing, back to top"
        >
          <img
            src="https://customer-assets.emergentagent.com/wingman/821fda20-6b65-4bc0-9677-fe505c145882/attachments/9468c975faec4774af2c1d56b4fe990d_RM_Logo-Mark_Red.png"
            alt="Rhys Morgan logo mark"
            className="h-9 w-auto object-contain transition-transform duration-500 group-hover:rotate-12"
          />
          <img
            src="https://customer-assets.emergentagent.com/wingman/821fda20-6b65-4bc0-9677-fe505c145882/attachments/6511d4ec723348b8b3b4e669e5e29ad8_RM_Text_White.png"
            alt="Rhys Morgan, Creative Marketing"
            className="hidden sm:block h-5 w-auto object-contain opacity-95"
          />
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navigation.map((n) => (
            <button
              key={n.href}
              onClick={() => scrollTo(n.href)}
              className="text-[13px] tracking-[0.08em] uppercase text-[#f2ece2]/80 hover:text-[#e3494e] transition-colors duration-300 link-underline"
            >
              {n.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button
            onClick={() => scrollTo('#contact')}
            className="bg-[#e3494e] hover:bg-[#c93b3f] text-white rounded-full h-11 px-5 text-[13px] tracking-wide border-0"
          >
            Request a Quote
            <ArrowUpRight className="ml-1 w-4 h-4" />
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden w-10 h-10 inline-flex items-center justify-center text-[#f2ece2]"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-[#0f0f0f] border-t border-[#1f1f1f]">
          <div className="px-6 py-8 flex flex-col gap-6">
            {navigation.map((n) => (
              <button
                key={n.href}
                onClick={() => scrollTo(n.href)}
                className="text-left font-display text-2xl text-[#f2ece2]"
              >
                {n.label}
              </button>
            ))}
            <Button
              onClick={() => scrollTo('#contact')}
              className="bg-[#e3494e] hover:bg-[#c93b3f] text-white rounded-full h-12 mt-2 w-full"
            >
              Request a Quote
              <ArrowUpRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
