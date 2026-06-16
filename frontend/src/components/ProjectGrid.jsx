import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '../mock';

const ProjectGrid = () => {
  return (
    <section className="py-20 md:py-28 border-t border-[#1f1f1f]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex items-end justify-between mb-14">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8a8378] mb-3">
              Selected Work
            </div>
            <h2 className="font-display-xl text-4xl md:text-7xl text-[#f2ece2] max-w-3xl">
              More projects, <span className="text-[#e3494e]">fewer words.</span>
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-14">
          {projects.map((p, i) => (
            <article
              key={p.id}
              className={`group cursor-pointer ${i % 2 === 1 ? 'md:mt-20' : ''}`}
            >
              <div className="img-tile">
                <img
                  src={p.thumbnail}
                  alt={p.client}
                  className="w-full h-[60vh] object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="mt-6 flex items-start justify-between gap-6">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8a8378]">
                    {p.sector}
                  </div>
                  <h3 className="mt-2 font-display uppercase tracking-tight text-xl md:text-2xl text-[#f2ece2] group-hover:text-[#e3494e] transition-colors duration-500 font-bold">
                    {p.client}
                  </h3>
                  <p className="mt-3 text-[14px] text-[#a8a195] max-w-md leading-relaxed font-light">
                    {p.blurb}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] uppercase tracking-[0.18em] text-[#8a8378] border border-[#2a2a2a] rounded-full px-2.5 py-1"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="shrink-0 w-11 h-11 rounded-full border border-[#2a2a2a] flex items-center justify-center text-[#f2ece2] group-hover:bg-[#e3494e] group-hover:border-[#e3494e] group-hover:text-white transition-all duration-500">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectGrid;