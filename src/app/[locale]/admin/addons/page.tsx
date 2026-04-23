import { API_URL } from "@/config/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "../components/Sidebar";
import AddonsClient from "./AddonsClient";

export default async function AdminAddonsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_session");

  if (!isAdmin) {
    redirect(`/${locale}/admin/login`);
  }

  return (
    <div className="min-h-screen bg-[#0A0B10] text-white flex">
      <Sidebar locale={locale} activePath={`/${locale}/admin/addons`} />

      <main className="flex-1 p-12 lg:p-16 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <AddonsClient />
        </div>
      </main>
    </div>
  );
}
