import React from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { hero, brand, clientsList } from '../mock';

const Hero = () => {
  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="top" className="relative pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden">
      {/* Soft accent gradient top-right (kept under 20% area) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full blur-3xl opacity-30"
        style={{
          background:
            'radial-gradient(closest-side, rgba(227,73,78,0.35), rgba(227,73,78,0) 70%)',
        }}
      />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative">
        {/* Eyebrow row */}
        <div className="flex items-center gap-3 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#e3494e]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8a8378]">
            {hero.eyebrow}
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display font-light text-[clamp(3rem,9vw,9.5rem)] leading-[0.95] tracking-[-0.03em] text-[#f2ece2]">
          {hero.headlineLines.map((line, i) => (
            <span key={i} className="block">
              {line === 'substance,' ? (
                <em className="italic text-[#e3494e] font-normal">substance,</em>
              ) : (
                line
              )}
            </span>
          ))}
        </h1>

        {/* Sub + meta */}
        <div className="mt-14 grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-6 md:col-start-6">
            <p className="text-[17px] md:text-[19px] leading-relaxed text-[#d8d2c6] max-w-xl">
              {hero.subcopy}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                onClick={() => scrollTo('#contact')}
                className="group inline-flex items-center gap-2 bg-[#e3494e] hover:bg-[#c93b3f] text-white rounded-full h-14 px-7 text-[14px] tracking-wide transition-colors"
              >
                Book a Consultation
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
              <button
                onClick={() => scrollTo('#work')}
                className="inline-flex items-center gap-3 text-[14px] tracking-wide text-[#f2ece2] border-b border-[#f2ece2]/40 pb-1 hover:border-[#e3494e] hover:text-[#e3494e] transition-colors"
              >
                See selected work
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-24 md:mt-32 grid grid-cols-3 gap-6 md:gap-12 border-t border-[#1f1f1f] pt-10">
          {hero.stats.map((s) => (
            <div key={s.label}>
              <div className="font-display text-3xl md:text-5xl text-[#f2ece2]">{s.value}</div>
              <div className="mt-2 text-[11px] md:text-[12px] uppercase tracking-[0.18em] text-[#8a8378]">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Client marquee */}
      <div className="mt-24 md:mt-28 border-y border-[#1f1f1f] py-6 overflow-hidden relative">
        <div className="flex w-max animate-marquee gap-16 whitespace-nowrap">
          {[...clientsList, ...clientsList].map((c, i) => (
            <span
              key={i}
              className="font-display italic text-2xl md:text-3xl text-[#5c564c]"
            >
              {c}
              <span className="mx-8 text-[#e3494e]">—</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
