import { API_URL } from "@/config/api";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import GalleryClient from "./GalleryClient";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.gallery" });
  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
  };
}

export default async function GalleryPage() {
  const images = await fetch("${API_URL}/api/gallery", { cache: "no-store" })
    .then(res => res.json())
    .catch(() => []);

  return <GalleryClient initialImages={images} />;
}
