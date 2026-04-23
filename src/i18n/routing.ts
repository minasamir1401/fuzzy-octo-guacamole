import { API_URL } from "@/config/api";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar", "de", "ru"],
  defaultLocale: "en",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/diving": {
      en: "/diving",
      ar: "/غوص",
      de: "/tauchen",
      ru: "/дайвинг",
    },
    "/packages": {
      en: "/packages",
      ar: "/الباقات",
      de: "/pakete",
      ru: "/пакеты",
    },
    "/gallery": {
      en: "/gallery",
      ar: "/المعرض",
      de: "/galerie",
      ru: "/галерея",
    },
    "/contact": {
      en: "/contact",
      ar: "/اتصل-بنا",
      de: "/kontakt",
      ru: "/контакты",
    },
    "/blog": {
      en: "/blog",
      ar: "/المدونة",
      de: "/blog",
      ru: "/блог",
    },
    "/blog/[slug]": {
      en: "/blog/[slug]",
      ar: "/المدونة/[slug]",
      de: "/blog/[slug]",
      ru: "/блог/[slug]",
    },
    "/booking": {
      en: "/booking",
      ar: "/حجز",
      de: "/buchung",
      ru: "/бронирование",
    },
  },
});

export type Locale = (typeof routing.locales)[number];
