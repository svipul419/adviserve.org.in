import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '../lib/constants';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  robots?: string;
  structuredData?: object | object[] | null;
}

export default function SEOHead({
  title,
  description,
  canonical,
  ogImage,
  ogType = 'website',
  robots = 'index, follow',
  structuredData,
}: SEOHeadProps) {
  const siteTitle = 'Adviserve - HR & Corporate Services';
  const fullTitle = title ? `${title} | Adviserve` : siteTitle;
  const siteUrl = SITE_URL;
  const resolvedOgImage = ogImage?.startsWith('http') ? ogImage : `${siteUrl}${ogImage || '/adviserve-logo.png'}`;

  const schemas = Array.isArray(structuredData)
    ? structuredData.filter(Boolean)
    : structuredData
    ? [structuredData]
    : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {robots && <meta name="robots" content={robots} />}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={resolvedOgImage} />
      {canonical && <meta property="og:url" content={canonical} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={resolvedOgImage} />

      {/* Structured Data */}
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema).replace(/<\//g, '<\\/')}
        </script>
      ))}
    </Helmet>
  );
}
