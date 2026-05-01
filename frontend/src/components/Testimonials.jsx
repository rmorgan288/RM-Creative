import React from 'react';
import { testimonials } from '../mock';

const Testimonials = () => {
  return (
    <section className="py-24 md:py-32 bg-[#121212] border-t border-[#1f1f1f]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8a8378] mb-10">
          § From the people I’ve worked with
        </div>
        <div className="grid md:grid-cols-3 gap-10 md:gap-14">
          {testimonials.map((t, i) => (
            <figure key={i} className="border-t border-[#2a2a2a] pt-8">
              <span className="font-display text-5xl text-[#e3494e] leading-none font-bold">“</span>
              <blockquote className="mt-3 text-lg md:text-xl text-[#f2ece2] leading-snug font-light">
                {t.quote}
              </blockquote>
              <figcaption className="mt-8 font-sub text-[11px] text-[#8a8378]">
                — {t.author}
                <span className="block text-[#5c564c] mt-1 tracking-[0.14em]">{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
