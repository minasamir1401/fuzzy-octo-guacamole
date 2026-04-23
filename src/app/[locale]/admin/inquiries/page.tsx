import { API_URL } from "@/config/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "../components/Sidebar";
import { getTranslations } from "next-intl/server";
import InquiriesClient from "./InquiriesClient";

export default async function ManageInquiries({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("admin.inquiries");
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_session");

  if (!isAdmin) {
    redirect(`/${locale}/admin/login`);
  }

  let inquiries = [];
  try {
    const res = await fetch(`${API_URL}/api/inquiries`, { cache: "no-store" });
    if (res.ok) {
      inquiries = await res.json();
    }
  } catch (error) {
    console.error("Error fetching inquiries for admin:", error);
  }

  return (
    <div className="min-h-screen bg-[#0A0B10] text-white flex">
      <Sidebar locale={locale} activePath={`/${locale}/admin/inquiries`} />

      <main className="flex-1 p-12 lg:p-16 overflow-y-auto">
        <InquiriesClient 
          initialInquiries={inquiries} 
          locale={locale} 
          t={{
            title: t("title"),
            subtitle: t("subtitle")
          }} 
        />
      </main>
    </div>
  );
}
