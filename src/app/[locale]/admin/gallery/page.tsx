import { API_URL } from "@/config/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "../components/Sidebar";
import GalleryClient from "./GalleryClient";
import { getTranslations } from "next-intl/server";

export default async function ManageGallery({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("admin.gallery");
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_session");

  if (!isAdmin) {
    redirect(`/${locale}/admin/login`);
  }

  let galleryItems = [];
  try {
    const res = await fetch(`${API_URL}/api/gallery`, { cache: "no-store" });
    if (res.ok) {
      galleryItems = await res.json();
    }
  } catch (error) {
    console.error("Error fetching gallery for admin:", error);
  }

  return (
    <div className="min-h-screen bg-[#0A0B10] text-white flex">
      <Sidebar locale={locale} activePath={`/${locale}/admin/gallery`} />

      <main className="flex-1 p-12 lg:p-16 overflow-y-auto">
        <GalleryClient 
          initialImages={galleryItems} 
          locale={locale} 
          t={{
            title: t("title"),
            subtitle: t("subtitle"),
            addImage: t("addImage")
          }}
        />
      </main>
    </div>
  );
}
