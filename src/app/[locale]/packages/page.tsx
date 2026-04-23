import { API_URL } from "@/config/api";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import PackagesClient from "./PackagesClient";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.packages" });
  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
  };
}

import PricingTable from "@/components/PricingTable";

export default async function PackagesPage({ params }: Props) {
  const { locale } = await params;
  
  // Fetch packages from the API
  let packages = [];
  try {
    const res = await fetch(`${API_URL}/api/packages`, { cache: "no-store" });
    if (res.ok) {
      packages = await res.json();
    }
  } catch (error) {
    console.error("Error fetching packages:", error);
  }

  return (
    <>
      <PackagesClient 
        initialPackages={packages} 
      />
      <PricingTable locale={locale} />
    </>
  );
}
