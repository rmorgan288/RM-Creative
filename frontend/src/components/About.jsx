import React from 'react';
import { useSiteContent } from '../contexts/SiteContentContext';

const About = () => {
  const { brand, about, processSteps } = useSiteContent();
  const portrait =
    'https://images.unsplash.com/photo-1600896997793-b8ed3459a17f?crop=entropy&cs=srgb&fm=jpg&q=85';
  const workspace =
    'https://images.pexels.com/photos/8774458/pexels-photo-8774458.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940';

  return (
    <section
      id="about"
      className="py-24 md:py-32 bg-[#121212] border-t border-[#1f1f1f]"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
          {/* Left: portrait */}
          <div className="md:col-span-5 space-y-6">
            <div className="img-tile">
              <img
                src={portrait}
                alt="Rhys Morgan portrait"
                className="w-full h-[60vh] object-cover grayscale hover:grayscale-0 transition-all duration-700"
                loading="lazy"
              />
            </div>
            <div className="img-tile hidden md:block">
              <img
                src={workspace}
                alt="Studio workspace"
                className="w-full h-[34vh] object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right: copy */}
          <div className="md:col-span-7 md:pl-6">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8a8378] mb-4">
              § {about.eyebrow}
            </div>
            <h2 className="font-display-xl text-3xl md:text-5xl text-[#f2ece2]">
              {about.heading}
              <br />
              <span className="text-[#e3494e]">{about.headingAccent}</span>
            </h2>

            <div className="mt-8 space-y-5 text-[16px] text-[#c9c2b5] leading-relaxed max-w-2xl font-light">
              {about.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* Process — The 4D Framework */}
            <div className="mt-16">
              <div className="flex items-baseline gap-3 mb-8">
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8a8378]">
                  § The 4D Framework
                </span>
                <span className="hidden sm:inline-block w-8 h-px bg-[#3a3a3a]" />
                <span className="hidden sm:inline-block font-sub text-[10px] text-[#5c564c]">
                  How I work
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
                {processSteps.map((s) => (
                  <div
                    key={s.step}
                    className="border-t border-[#2a2a2a] pt-5 group"
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-[11px] text-[#e3494e]">
                        {s.step}
                      </span>
                      <h4 className="font-display uppercase tracking-wider text-base text-[#f2ece2] font-bold group-hover:text-[#e3494e] transition-colors">
                        {s.title}
                      </h4>
                    </div>
                    <p className="mt-2 text-[14px] text-[#a8a195] leading-relaxed font-light">
                      {s.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
