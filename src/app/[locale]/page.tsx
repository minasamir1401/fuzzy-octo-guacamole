import { API_URL } from "@/config/api";
import HomeClient from "./HomeClient";
import PricingTable from "@/components/PricingTable";

export const dynamic = "force-dynamic";
export const revalidate = 0;
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  
  // Fetch packages from the API
  let packages = [];
  try {
    const res = await fetch(`${API_URL}/api/packages`, { cache: "no-store" });
    if (res.ok) {
      const allPackages = await res.json();
      // Filter featured packages or take first 3
      const featured = allPackages.filter((pkg: any) => pkg.isFeatured);
      packages = featured.length > 0 ? featured.slice(0, 10) : allPackages.slice(0, 3);
    }
  } catch (error) {
    console.error("Error fetching packages:", error);
  }

  return (
    <HomeClient 
      initialPackages={packages} 
      pricingTable={<PricingTable locale={locale} />}
    />
  );
}
