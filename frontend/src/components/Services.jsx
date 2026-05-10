import React from 'react';
import { useSiteContent } from '../contexts/SiteContentContext';
import { ArrowUpRight, Repeat } from 'lucide-react';

const Services = () => {
  const { services, retainer } = useSiteContent();
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="py-24 md:py-32 border-t border-[#1f1f1f]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Section header */}
        <div className="grid md:grid-cols-12 gap-10 mb-16 md:mb-20">
          <div className="md:col-span-7">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8a8378] mb-4">
              § Services
            </div>
            <h2 className="font-display-xl text-4xl md:text-6xl text-[#f2ece2]">
              Four ways I can <span className="text-[#e3494e]">work with you.</span>
            </h2>
          </div>
          <div className="md:col-span-5 md:pt-4">
            <p className="text-[#a8a195] text-[15px] leading-relaxed font-light">
              Every engagement is scoped to fit. Most projects run 6–12 weeks, with monthly
              retainers reserved for a handful of long-term partners.
            </p>
          </div>
        </div>

        {/* 2 x 2 grid */}
        <div className="grid md:grid-cols-2 gap-px bg-[#1f1f1f] border border-[#1f1f1f] rounded-sm overflow-hidden">
          {services.map((s) => (
            <article
              key={s.number}
              className="group relative bg-[#0f0f0f] p-8 md:p-12 transition-colors duration-500 hover:bg-[#141414]"
            >
              <div className="flex items-start justify-between mb-10 md:mb-14">
                <span className="font-mono text-[12px] text-[#e3494e]">{s.number}</span>
                <span className="w-10 h-10 rounded-full border border-[#2a2a2a] inline-flex items-center justify-center text-[#8a8378] group-hover:bg-[#e3494e] group-hover:border-[#e3494e] group-hover:text-white transition-all duration-500">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>

              <h3 className="font-display uppercase tracking-tight text-3xl md:text-4xl text-[#f2ece2] font-bold leading-[1.05]">
                {s.title}
              </h3>

              <p className="mt-5 text-[15px] text-[#c9c2b5] leading-relaxed font-light max-w-md">
                {s.description}
              </p>

              <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-2.5 max-w-md">
                {s.deliverables.map((d) => (
                  <li
                    key={d}
                    className="flex items-center gap-3 text-[13px] text-[#a8a195] font-light"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#e3494e] shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* Retainer feature panel — full-width, accented */}
        <article
          className="mt-12 md:mt-16 relative overflow-hidden rounded-sm border border-[#2a2a2a] bg-[#141414] p-8 md:p-14"
        >
          {/* Subtle red corner glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 -right-24 w-[420px] h-[420px] rounded-full blur-3xl opacity-30"
            style={{
              background:
                'radial-gradient(closest-side, rgba(227,73,78,0.45), rgba(227,73,78,0) 70%)',
            }}
          />

          <div className="relative grid md:grid-cols-12 gap-8 md:gap-12 items-start">
            {/* Left — header + meta */}
            <div className="md:col-span-5">
              <div className="flex items-center gap-3 mb-6">
                <span className="font-mono text-[12px] text-[#e3494e]">{retainer.number}</span>
                <span className="font-sub text-[11px] text-[#8a8378]">
                  § {retainer.label}
                </span>
              </div>
              <h3 className="font-display uppercase tracking-tight text-3xl md:text-4xl text-[#f2ece2] font-bold leading-[1.05]">
                {retainer.title}
              </h3>
              <button
                type="button"
                onClick={scrollToContact}
                className="mt-8 inline-flex items-center gap-2 bg-[#e3494e] hover:bg-[#c93b3f] text-white rounded-full h-12 px-6 font-sub text-[11px] transition-colors group"
              >
                <Repeat className="w-3.5 h-3.5" />
                {retainer.cta}
                <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Right — description + inclusions */}
            <div className="md:col-span-7">
              <p className="text-[16px] text-[#c9c2b5] leading-relaxed font-light max-w-2xl">
                {retainer.description}
              </p>
              <ul className="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-3">
                {retainer.inclusions.map((d) => (
                  <li
                    key={d}
                    className="flex items-start gap-3 text-[14px] text-[#d8d2c6] font-light leading-snug"
                  >
                    <span className="mt-2 w-1 h-1 rounded-full bg-[#e3494e] shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default Services;
