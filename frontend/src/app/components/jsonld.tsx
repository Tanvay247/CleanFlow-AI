// app/components/jsonld.tsx
export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "CleanFlow AI",
    applicationCategory: "DataProcessingApplication",
    operatingSystem: "Web",
    description:
      "AI‑powered tool to clean CSV and Excel datasets for machine learning. Remove outliers, fill missing values, and get ML‑ready data instantly.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "128",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}