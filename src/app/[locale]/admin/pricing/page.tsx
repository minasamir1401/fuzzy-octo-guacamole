import { API_URL } from "@/config/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "../components/Sidebar";
import PricingClient from "./PricingClient";

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_session");

  if (!isAdmin) {
    redirect(`/${locale}/admin/login`);
  }

  // Fetch prices on server or client? Let's let PricingClient fetch it so it can handle CRUD easily.

  return (
    <div className="min-h-screen bg-[#0A0B10] text-white flex">
      <Sidebar locale={locale} activePath={`/${locale}/admin/pricing`} />
      <main className="flex-1 p-12 lg:p-16 overflow-y-auto">
        <PricingClient locale={locale} />
      </main>
    </div>
  );
}
