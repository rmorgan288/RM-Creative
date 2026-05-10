/**
 * SiteContentContext
 *
 * Single source for the homepage CMS values. Fetches /api/site-content once,
 * merges it with the mock defaults so any missing field never breaks the UI,
 * and exposes a unified shape that mirrors the existing mock structure.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { apiGetSiteContent } from '../lib/api';
import {
  hero as mockHero,
  about as mockAbout,
  services as mockServices,
  processSteps as mockProcessSteps,
  brand as mockBrand,
  retainer as mockRetainer,
  clientsList as mockClientsList,
  navigation as mockNavigation,
} from '../mock';

const SiteContentContext = createContext(null);

const pickStr = (val, fallback) =>
  typeof val === 'string' && val.trim() !== '' ? val : fallback;

const mergeArray = (apiArr, fallbackArr) => {
  if (!Array.isArray(apiArr)) return fallbackArr;
  return fallbackArr.map((fb, i) => ({ ...fb, ...(apiArr[i] || {}) }));
};

export const SiteContentProvider = ({ children }) => {
  // Start with defaults so first paint is instant; refine after fetch.
  const [content, setContent] = useState(() => buildLive(null));
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const remote = await apiGetSiteContent();
      setContent(buildLive(remote));
    } catch (e) {
      // Network/API error — keep defaults so the public site never breaks.
      setContent(buildLive(null));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <SiteContentContext.Provider value={{ ...content, loading, refresh }}>
      {children}
    </SiteContentContext.Provider>
  );
};

function buildLive(api) {
  const heroLines =
    Array.isArray(api?.hero?.headlineLines) && api.hero.headlineLines.length === 3
      ? api.hero.headlineLines
      : mockHero.headlineLines;

  const aboutBody =
    Array.isArray(api?.about?.body) && api.about.body.length > 0
      ? api.about.body
      : mockAbout.body;

  const mergedServices = mergeArray(api?.services, mockServices);
  const mergedProcess = mergeArray(api?.process, mockProcessSteps);

  return {
    hero: {
      ...mockHero,
      headlineLines: heroLines,
      subcopy: pickStr(api?.hero?.subcopy, mockHero.subcopy),
    },
    about: {
      ...mockAbout,
      heading: pickStr(api?.about?.heading, mockAbout.heading),
      headingAccent: pickStr(api?.about?.headingAccent, mockAbout.headingAccent),
      body: aboutBody,
    },
    services: mergedServices,
    processSteps: mergedProcess,
    retainer: mockRetainer,
    clientsList: mockClientsList,
    navigation: mockNavigation,
    brand: {
      ...mockBrand,
      email: pickStr(api?.contact?.email, mockBrand.email),
      whatsapp: pickStr(api?.contact?.whatsapp, mockBrand.whatsapp),
      whatsappDisplay: pickStr(
        api?.contact?.whatsappDisplay,
        mockBrand.whatsappDisplay
      ),
    },
  };
}

export const useSiteContent = () => {
  const ctx = useContext(SiteContentContext);
  if (!ctx) {
    // Allow components to work outside the provider by returning defaults.
    return { ...buildLive(null), loading: false, refresh: () => {} };
  }
  return ctx;
};
