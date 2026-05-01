import React from 'react';
import { brand, navigation } from '../mock';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#1f1f1f] pt-20 pb-10">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-6">
            <div className="flex items-center gap-4 mb-4">
              <img
                src="https://customer-assets.emergentagent.com/wingman/821fda20-6b65-4bc0-9677-fe505c145882/attachments/9468c975faec4774af2c1d56b4fe990d_RM_Logo-Mark_Red.png"
                alt="Rhys Morgan logo mark"
                className="h-14 w-auto object-contain"
              />
              <img
                src="https://customer-assets.emergentagent.com/wingman/821fda20-6b65-4bc0-9677-fe505c145882/attachments/6511d4ec723348b8b3b4e669e5e29ad8_RM_Text_White.png"
                alt="Rhys Morgan, Creative Marketing"
                className="h-9 w-auto object-contain"
              />
            </div>
            <p className="mt-4 font-sub text-[12px] text-[#8a8378]">
              Creative Marketing, based in South Wales — Est. {brand.since}
            </p>
          </div>
          <div className="md:col-span-3">
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#5c564c] mb-4">Explore</div>
            <ul className="space-y-2">
              {navigation.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    className="text-[15px] text-[#d8d2c6] hover:text-[#e3494e] transition-colors link-underline"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-3">
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#5c564c] mb-4">Direct</div>
            <ul className="space-y-2">
              <li>
                <a href={`mailto:${brand.email}`} className="text-[15px] text-[#d8d2c6] hover:text-[#e3494e] transition-colors">
                  {brand.email}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${brand.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[15px] text-[#d8d2c6] hover:text-[#e3494e] transition-colors"
                >
                  WhatsApp — {brand.whatsappDisplay}
                </a>
              </li>
              <li className="text-[15px] text-[#8a8378]">{brand.location}</li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-[#1f1f1f] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <span className="font-mono text-[11px] text-[#5c564c]">
            © {year} Rhys Morgan Creative Ltd. All rights reserved.
          </span>
          <span className="font-mono text-[11px] text-[#5c564c]">
            Designed & built in-house · v1.0
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
