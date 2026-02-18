type JsonLdProps = {
  data: Record<string, unknown>;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "InkLink Tattoo Finder",
    url: "https://inklinktattoofinder.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://inklinktattoofinder.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function localBusinessJsonLd(listing: {
  name: string;
  description?: string | null;
  address?: string | null;
  city: string;
  state: string;
  zipCode?: string | null;
  phone?: string | null;
  website?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  googleRating?: number | null;
  googleReviewCount?: number | null;
  hours?: Record<string, string> | null;
}) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TattooParlor",
    name: listing.name,
    description: listing.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: listing.address,
      addressLocality: listing.city,
      addressRegion: listing.state,
      postalCode: listing.zipCode,
      addressCountry: "US",
    },
  };

  if (listing.phone) data.telephone = listing.phone;
  if (listing.website) data.url = listing.website;
  if (listing.latitude && listing.longitude) {
    data.geo = {
      "@type": "GeoCoordinates",
      latitude: listing.latitude,
      longitude: listing.longitude,
    };
  }
  if (listing.googleRating) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: listing.googleRating,
      reviewCount: listing.googleReviewCount || 0,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return data;
}

export function itemListJsonLd(
  items: { name: string; url: string; position: number }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      name: item.name,
      url: item.url,
    })),
  };
}
