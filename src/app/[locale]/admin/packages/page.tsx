import { API_URL } from "@/config/api";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "../components/Sidebar";
import { getTranslations } from "next-intl/server";
import PackagesClient from "./PackagesClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ManagePackages({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("admin.packages");
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_session");

  if (!isAdmin) {
    redirect(`/${locale}/admin/login`);
  }

  const packages = await prisma.package.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-[#0A0B10] text-white flex">
      <Sidebar locale={locale} activePath={`/${locale}/admin/packages`} />

      <main className="flex-1 p-12 lg:p-16 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-16">
          <PackagesClient 
            initialPackages={packages} 
            locale={locale} 
            t={{ title: t("title"), subtitle: t("subtitle") }} 
          />
        </div>
      </main>
    </div>
  );
}
