import { API_URL } from "@/config/api";
import { motion } from "framer-motion";
import { ArrowRight, Filter, Info, Shield, Clock, Map, ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.diving" });
  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
  };
}

const trips = [
  {
    id: "d1",
    name: "Giftun Island Masterclass",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBahQe1zCSo6aeLkq0ltyh69tGR53tzh9-N3Hrq9GqjxkJC1EUHO8fsec--44ucZcKz4sxNk7iA5O37lPDkj7vDZF9I-Tdk5Mg-2LdtSDH_4RbqCCW4aY192u10_-c_BnyCgAE7YS6ihziJ5-TgQtuH-EXULFdhNg3sSsP9zuqbCaB9hHuEsShN8GQRdvNR7imcwh5QTq_UcA5Wz_TMBiky2g6o_ec_yPG-8HZ7kKZrkeOOpU_aYzYA6CQhYrPz39d1CCXLXo_zaJob",
    price: "$180",
    level: "All Levels",
    duration: "Full Day",
    location: "Hurghada",
  },
  {
    id: "d2",
    name: "Abu Ramada Deep Dive",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuChv_rGnRyWA5aHEGTXS2nK3jXW_ksAJI1zLPPzO4N1MLSoKcDlCJEN8FW0cRso9WCOarOWJrGlVcMGcRzwI8ac7FGiUtYizwstAVPvvIgRzzxJpDg1xo4XN9sVAdd4frEoCOyV-QvUmrno933WcUM1Ofrfv2I1idG0qeRqkHUXRG-hzzl4Vl1KrgMUMp-v3z4UYc0PHdp4WaSsRPGp0TRrMjRWYiAukAlH0o8kzFHrie85j4_P16-vESzD4nOoFFAUXjtGIT6qbjTg",
    price: "$210",
    level: "Advanced",
    duration: "6 Hours",
    location: "Hurghada",
  },
  {
    id: "d3",
    name: "Carless Reef Exploration",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOv73WLNEExsiTy96_wma9-HjJPDKWaAdIIzo3qBvtOXuebiStOBmMScVJlgI-mMdIyF3ylg9K-7v2RJDe9varwKERd2dbeveSkJ3d_1ggXxma1ug9cjjf5SYpt1YBdbNFvkeQROXyccGlvJ_YuH3HU-mDI9PuhJ7ftCKIPCU00qYfjJnXecLFdMuRKp9OZeErrLq7ZMpK_f6HMWqcHYz4wzZPOEPcWFYqtOeDEmdf9fJwIawYzGvgGPUnJBJgAUd_kVlAiUccMCR2",
    price: "$150",
    level: "Beginner",
    duration: "4 Hours",
    location: "Hurghada",
  }
];

// Note: In Next.js App Router, you can't mix "use client" and generateMetadata in the same file.
// I'll create a Client Component for the interactive parts.
import DivingClient from "./DivingClient";

import PricingTable from "@/components/PricingTable";

export default async function DivingPage({ params }: Props) {
  const { locale: lang } = await params;
  
  return (
    <>
      <DivingClient trips={trips} />
      <PricingTable locale={lang} />
    </>
  );
}
