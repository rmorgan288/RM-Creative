import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { featuredProject } from '../mock';

const FeaturedCase = () => {
  const p = featuredProject;
  return (
    <section id="work" className="pt-28 md:pt-40 pb-20 md:pb-28">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Section label */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8a8378] mb-3">
              Featured Case Study
            </div>
            <h2 className="font-display-xl text-4xl md:text-7xl text-[#f2ece2]">
              {p.client}
            </h2>
          </div>
          <div className="hidden md:block text-right">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8a8378]">
              {p.sector}
            </div>
          </div>
        </div>

        {/* Cover */}
        <div className="img-tile rounded-sm overflow-hidden">
          <img
            src={p.cover}
            alt={`${p.client} cover`}
            className="w-full h-[56vh] md:h-[82vh] object-cover"
            loading="eager"
            fetchpriority="high"
            decoding="async"
          />
        </div>

        {/* Headline + summary */}
        <div className="mt-14 grid md:grid-cols-12 gap-10">
          <h3 className="md:col-span-7 font-display uppercase tracking-tight text-2xl md:text-4xl leading-[1.1] text-[#f2ece2] font-bold">
            {p.headline}
          </h3>
          <div className="md:col-span-5 md:pt-4">
            <p className="text-[16px] leading-relaxed text-[#d8d2c6]">{p.summary}</p>
            <div className="mt-8 flex flex-wrap gap-2">
              {p.deliverables.map((d) => (
                <span
                  key={d}
                  className="text-[11px] uppercase tracking-[0.15em] text-[#d8d2c6] border border-[#2a2a2a] rounded-full px-3 py-1.5"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="mt-16 grid md:grid-cols-2 gap-6">
          {p.gallery.map((src, i) => (
            <div key={i} className="img-tile">
              <img
                src={src}
                alt={`${p.client} detail ${i + 1}`}
                className="w-full h-[60vh] object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>

        {/* Results */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1f1f1f] border border-[#1f1f1f] rounded-sm overflow-hidden">
          {p.results.map((r) => (
            <div key={r.label} className="bg-[#0f0f0f] p-8 md:p-10">
              <div className="font-display-xl text-5xl md:text-7xl text-[#e3494e]">{r.kpi}</div>
              <div className="mt-4 text-[13px] text-[#d8d2c6] max-w-xs leading-relaxed font-light">{r.label}</div>
            </div>
          ))}
        </div>

        {/* Pull quote */}
        <figure className="mt-20 md:mt-28 max-w-4xl">
          <blockquote className="font-display text-2xl md:text-4xl leading-[1.25] text-[#f2ece2] font-medium">
            <span className="text-[#e3494e]">"</span>
            {p.quote.text}
            <span className="text-[#e3494e]">"</span>
          </blockquote>
          <figcaption className="mt-6 font-sub text-[12px] text-[#8a8378]">
            — {p.quote.client}
          </figcaption>
        </figure>
      </div>
    </section>
  );
};

export default FeaturedCase;