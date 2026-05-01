import React from 'react';
import { services } from '../mock';
import { Plus } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

const Services = () => {
  return (
    <section id="services" className="py-24 md:py-32 border-t border-[#1f1f1f]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8a8378] mb-4">
              § Services
            </div>
            <h2 className="font-display text-4xl md:text-6xl leading-[1.05] text-[#f2ece2]">
              Four ways we can <em className="italic text-[#e3494e]">work together.</em>
            </h2>
            <p className="mt-8 text-[#a8a195] text-[15px] leading-relaxed max-w-md">
              Every engagement is scoped to fit. Most projects run 6–12 weeks, with monthly
              retainers reserved for a handful of long-term partners.
            </p>
          </div>

          <div className="md:col-span-7">
            <Accordion type="single" collapsible defaultValue="item-01" className="w-full">
              {services.map((s) => (
                <AccordionItem
                  key={s.number}
                  value={`item-${s.number}`}
                  className="border-b border-[#2a2a2a]"
                >
                  <AccordionTrigger className="py-6 hover:no-underline group">
                    <div className="flex items-baseline gap-6 w-full text-left">
                      <span className="font-mono text-[11px] text-[#8a8378] group-hover:text-[#e3494e] transition-colors">
                        {s.number}
                      </span>
                      <span className="font-display text-2xl md:text-3xl text-[#f2ece2] group-hover:text-[#e3494e] transition-colors">
                        {s.title}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-8">
                    <div className="pl-0 md:pl-12 grid md:grid-cols-2 gap-8">
                      <p className="text-[15px] text-[#c9c2b5] leading-relaxed">{s.description}</p>
                      <ul className="space-y-2">
                        {s.deliverables.map((d) => (
                          <li key={d} className="flex items-center gap-3 text-[13px] text-[#a8a195]">
                            <span className="w-1 h-1 rounded-full bg-[#e3494e]" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
