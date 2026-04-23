import { API_URL } from "@/config/api";
import { useTranslations } from "next-intl";

export default function StructuredData() {
  const t = useTranslations("schema");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": t("businessName"),
    "description": t("description"),
    "address": {
      "@type": "PostalAddress",
      "streetAddress": t("address"),
      "addressLocality": "Hurghada",
      "addressRegion": "Red Sea",
      "addressCountry": "EG"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 27.2579,
      "longitude": 33.8116
    },
    "url": "https://azureabyss-hurghada.com",
    "telephone": "+20123456789",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "08:00",
        "closes": "20:00"
      }
    ],
    "image": "https://azureabyss-hurghada.com/og-image.jpg"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
