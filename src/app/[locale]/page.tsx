import { API_URL } from "@/config/api";
import { prisma } from "@/lib/prisma";
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
  
  // Fetch featured packages from the database
  const featuredPackages = await prisma.package.findMany({
    where: { isFeatured: true },
    take: 10,
    orderBy: { price: 'asc' }
  });

  // If no featured packages, just take the first 3
  let packages = featuredPackages;
  if (packages.length === 0) {
    packages = await prisma.package.findMany({
      take: 3,
      orderBy: { price: 'asc' }
    });
  }

  return (
    <HomeClient 
      initialPackages={packages} 
      pricingTable={<PricingTable locale={locale} />}
    />
  );
}
