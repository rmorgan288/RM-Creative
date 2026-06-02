import React from 'react';
import { Helmet } from 'react-helmet-async';

// Brand-wide defaults — single source of truth
const SITE_NAME = 'Rhys Morgan — Creative Marketing';
const DEFAULT_DESCRIPTION =
  'Freelance Graphic Designer and Creative Director based in Blaenau Gwent, South Wales. Brand identity, web design and marketing services for ambitious teams.';
const LOGO_URL =
  'https://customer-assets.emergentagent.com/wingman/821fda20-6b65-4bc0-9677-fe505c145882/attachments/9468c975faec4774af2c1d56b4fe990d_RM_Logo-Mark_Red.png';

const getOrigin = () => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return '';
};

export const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image = LOGO_URL,
  type = 'website',
  robots = 'index, follow',
  jsonLd = null,
}) => {
  const origin = getOrigin();
  const url = `${origin}${path}`;
  const fullTitle = title ? `${title}` : SITE_NAME;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={url} />

      {/* OpenGraph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content="Rhys Morgan logo mark" />
      <meta property="og:locale" content="en_GB" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD structured data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
