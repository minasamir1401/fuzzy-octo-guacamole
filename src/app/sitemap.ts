import { API_URL } from "@/config/api";
import { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://azureabyss-hurghada.com";
  
  const pages = ["", "/diving", "/packages", "/gallery", "/contact", "/blog"];
  
  const sitemapEntries: MetadataRoute.Sitemap = [];

  routing.locales.forEach((locale) => {
    pages.forEach((page) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: page === "" ? 1 : 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/en${page}`,
            ar: `${baseUrl}/ar${page}`,
            de: `${baseUrl}/de${page}`,
            ru: `${baseUrl}/ru${page}`,
          },
        },
      });
    });
  });

  return sitemapEntries;
}
