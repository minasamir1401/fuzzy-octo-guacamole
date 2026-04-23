import { API_URL } from "@/config/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Calendar, Package, MessageSquare, Plus } from "lucide-react";
import Link from "next/link";
import Sidebar from "./components/Sidebar";
import { getTranslations } from "next-intl/server";
import RecentBookingsClient from "./components/RecentBookingsClient";

export default async function AdminDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("admin.dashboard");
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_session");

  if (!isAdmin) {
    redirect(`/${locale}/admin/login`);
  }

  let bookingsCount = 0;
  let packagesCount = 0;
  let inquiriesCount = 0;
  let recentBookings = [];

  try {
    const [bookingsRes, packagesRes, inquiriesRes] = await Promise.all([
      fetch(`${API_URL}/api/bookings`, { cache: "no-store" }),
      fetch(`${API_URL}/api/packages`, { cache: "no-store" }),
      fetch(`${API_URL}/api/inquiries`, { cache: "no-store" }),
    ]);

    if (bookingsRes.ok) {
      const bookings = await bookingsRes.json();
      bookingsCount = bookings.length;
      recentBookings = bookings.slice(0, 5);
    }
    if (packagesRes.ok) {
      const packages = await packagesRes.json();
      packagesCount = packages.length;
    }
    if (inquiriesRes.ok) {
      const inquiries = await inquiriesRes.json();
      inquiriesCount = inquiries.length;
    }
  } catch (error) {
    console.error("Error fetching admin stats:", error);
  }

  const stats = [
    { label: t("stats.bookings"), value: bookingsCount, icon: Calendar, color: "text-blue-400" },
    { label: t("stats.packages"), value: packagesCount, icon: Package, color: "text-emerald-400" },
    { label: t("stats.inquiries"), value: inquiriesCount, icon: MessageSquare, color: "text-amber-400" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0B10] text-white flex">
      <Sidebar locale={locale} activePath={`/${locale}/admin`} />

      <main className="flex-1 p-12 lg:p-16 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-16">
          <header className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-serif font-bold mb-4">{t("welcome")}</h1>
              <p className="text-white/40 text-lg">{t("subtitle")}</p>
            </div>
            <div className="flex gap-4">
              <Link 
                href={`/${locale}/admin/packages`}
                className="flex items-center gap-3 px-8 py-4 bg-secondary text-primary font-bold rounded-2xl hover:bg-white transition-all shadow-2xl active:scale-95 group"
              >
                <Plus size={24} />
                {t("stats.packages")}
              </Link>
              <div className="hidden sm:flex glass px-8 py-4 rounded-2xl items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-bold tracking-wide uppercase">{t("systemOnline")}</span>
              </div>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-[#12141C] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl transition-all hover:translate-y-[-8px] hover:border-secondary/20 group">
                <div className="flex justify-between items-start mb-8">
                  <div className={`p-5 rounded-2xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon size={28} />
                  </div>
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{t("stats.growth")}</span>
                </div>
                <h3 className="text-5xl font-bold mb-2 tracking-tighter">{stat.value}</h3>
                <p className="text-white/40 text-sm font-bold uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Recent Bookings Table */}
          <div className="bg-[#12141C] rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden">
            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <h2 className="text-2xl font-serif font-bold">{t("recentBookings.title")}</h2>
              <Link href={`/${locale}/admin/bookings`} className="px-6 py-2 rounded-full border border-secondary/30 text-secondary text-sm font-bold hover:bg-secondary hover:text-primary transition-all">
                {t("recentBookings.viewAll")}
              </Link>
            </div>
            
            <RecentBookingsClient 
              bookings={recentBookings} 
              locale={locale} 
            />
          </div>
        </div>
      </main>
    </div>
  );
}
