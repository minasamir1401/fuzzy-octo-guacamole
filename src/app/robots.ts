import { API_URL } from "@/config/api";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://azureabyss-hurghada.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/booking/success"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
