// JSON-LD structured data generators

export function generateOrganizationSchema(settings: Record<string, string>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: settings.business_name || 'Adviserve',
    url: settings.website || 'https://adviserve.org.in',
    logo: settings.default_og_image || '',
    description: 'Integrated business advisory firm offering recruitment, HR consulting, legal compliance, business strategy, corporate training, and IT solutions across India.',
    foundingDate: '2017',
    areaServed: 'India',
    knowsAbout: ['Recruitment', 'HR Consulting', 'Legal Compliance', 'Business Strategy', 'Corporate Training', 'IT Consulting'],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: settings.phone || '',
      email: settings.email || 'info@adviserve.org.in',
      contactType: 'customer service',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Advisory Services',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Recruitment & Talent Acquisition' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'HR Consulting & Outsourcing' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Legal & Compliance Advisory' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Business Strategy & Consulting' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Corporate Training & L&D' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'IT Consulting & Development' } },
      ],
    },
    sameAs: [
      settings.facebook_url,
      settings.twitter_url,
      settings.linkedin_url,
      settings.instagram_url,
      settings.youtube_url,
    ].filter(Boolean),
  };
}

export function generateLocalBusinessSchema(settings: Record<string, string>) {
  const hours = (() => {
    try { return JSON.parse(settings.opening_hours || '[]'); } catch { return []; }
  })();

  return {
    '@context': 'https://schema.org',
    '@type': settings.business_type || 'ProfessionalService',
    name: settings.business_name || '',
    url: settings.website || '',
    telephone: settings.phone || '',
    email: settings.email || '',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address_street || '',
      addressLocality: settings.address_city || '',
      addressRegion: settings.address_state || '',
      postalCode: settings.address_postal || '',
      addressCountry: settings.address_country || 'IN',
    },
    ...(settings.latitude && settings.longitude ? {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: settings.latitude,
        longitude: settings.longitude,
      },
    } : {}),
    ...(hours.length > 0 ? {
      openingHoursSpecification: hours.map((h: { day: string; open: string; close: string }) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: h.day,
        opens: h.open,
        closes: h.close,
      })),
    } : {}),
  };
}

export function generateFAQSchema(items: { question: string; answer: string }[]) {
  if (!items.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateServiceSchema(service: {
  title: string;
  description: string;
  slug: string;
}, baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    url: `${baseUrl}/services/${service.slug}`,
    provider: {
      '@type': 'Organization',
      name: 'Adviserve',
    },
  };
}

export function generateBlogPostSchema(post: {
  title: string;
  excerpt?: string | null;
  slug: string;
  author?: string | null;
  published_at?: string | null;
  cover_image?: string | null;
}, baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || '',
    url: `${baseUrl}/blog/${post.slug}`,
    ...(post.author ? { author: { '@type': 'Person', name: post.author } } : {}),
    ...(post.published_at ? { datePublished: post.published_at } : {}),
    ...(post.cover_image ? { image: post.cover_image } : {}),
    publisher: {
      '@type': 'Organization',
      name: 'Adviserve',
    },
  };
}

export function generateWebSiteSchema(settings: Record<string, string>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings.business_name || 'Adviserve',
    url: settings.website || 'https://adviserve.org.in',
  };
}

export function generateSoftwareApplicationSchema(product: {
  title: string;
  description: string;
  slug: string;
  priceCurrency?: string;
  price?: string;
  priceDescription?: string;
}, baseUrl: string) {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: product.title,
    description: product.description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: `${baseUrl}/products/${product.slug}`,
  };
  if (product.price && product.priceCurrency) {
    schema.offers = {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.priceCurrency,
      ...(product.priceDescription ? { description: product.priceDescription } : {}),
    };
  }
  return schema;
}

export function generateWebPageSchema(page: {
  title: string;
  description: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.description,
    url: page.url,
  };
}
