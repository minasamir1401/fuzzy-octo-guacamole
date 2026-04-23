import { API_URL } from "@/config/api";
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Playfair_Display, Inter } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.home" });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://azureabyss-hurghada.com";

  const alternates: Record<string, string> = {};
  routing.locales.forEach((loc) => {
    alternates[loc] = `${baseUrl}/${loc}`;
  });

  return {
    metadataBase: new URL(baseUrl),
    title: {
      template: `%s | ${t("title")}`,
      default: t("title"),
    },
    description: t("description"),
    keywords: t("keywords"),
    authors: [{ name: "Azure Abyss Hurghada" }],
    creator: "Azure Abyss Hurghada",
    publisher: "Azure Abyss Hurghada",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: locale,
      alternateLocale: routing.locales.filter((l) => l !== locale),
      title: t("title"),
      description: t("description"),
      siteName: "Azure Abyss Hurghada",
      url: `${baseUrl}/${locale}`,
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: "Azure Abyss Hurghada Diving",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [`${baseUrl}/og-image.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        "en": `${baseUrl}/en`,
        "ar": `${baseUrl}/ar`,
        "de": `${baseUrl}/de`,
        "ru": `${baseUrl}/ru`,
        "x-default": `${baseUrl}/en`,
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const isRTL = locale === "ar";
  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  // Fetch global settings
  let showPackagesPage = true;
  try {
    const res = await fetch(`${API_URL}/api/settings`, { cache: "no-store" });
    if (res.ok) {
      const settings = await res.json();
      showPackagesPage = settings.showPackagesPage !== "false";
    }
  } catch (error) {
    console.error("Error fetching settings:", error);
  }

  return (
    <html
      lang={locale}
      dir={isRTL ? "rtl" : "ltr"}
      className={`${playfair.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* hreflang tags */}
        <link rel="alternate" hrefLang="en" href={`${process.env.NEXT_PUBLIC_BASE_URL || "https://azureabyss-hurghada.com"}/en`} />
        <link rel="alternate" hrefLang="ar" href={`${process.env.NEXT_PUBLIC_BASE_URL || "https://azureabyss-hurghada.com"}/ar`} />
        <link rel="alternate" hrefLang="de" href={`${process.env.NEXT_PUBLIC_BASE_URL || "https://azureabyss-hurghada.com"}/de`} />
        <link rel="alternate" hrefLang="ru" href={`${process.env.NEXT_PUBLIC_BASE_URL || "https://azureabyss-hurghada.com"}/ru`} />
        <link rel="alternate" hrefLang="x-default" href={`${process.env.NEXT_PUBLIC_BASE_URL || "https://azureabyss-hurghada.com"}/en`} />
      </head>
      <body className="font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar showPackagesPage={showPackagesPage} />
          <div className="pb-24 md:pb-0">
            {children}
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
