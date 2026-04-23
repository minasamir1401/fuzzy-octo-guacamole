import { API_URL } from "@/config/api";
import { LayoutDashboard, Users, Package, MessageSquare, ExternalLink, Image as ImageIcon, Settings, DollarSign, Sparkles } from "lucide-react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { getTranslations } from "next-intl/server";

interface SidebarProps {
  locale: string;
  activePath: string;
}

export default async function Sidebar({ locale, activePath }: SidebarProps) {
  const t = await getTranslations("admin.sidebar");

  const menuItems = [
    { label: t("dashboard"), icon: LayoutDashboard, href: `/${locale}/admin` },
    { label: t("bookings"), icon: Users, href: `/${locale}/admin/bookings` },
    { label: t("packages"), icon: Package, href: `/${locale}/admin/packages` },
    { label: "Booking Add-ons", icon: Sparkles, href: `/${locale}/admin/addons` },
    { label: t("gallery"), icon: ImageIcon, href: `/${locale}/admin/gallery` },
    { label: t("inquiries"), icon: MessageSquare, href: `/${locale}/admin/inquiries` },
    { label: t("pricing"), icon: DollarSign, href: `/${locale}/admin/pricing` },
    { label: t("settings"), icon: Settings, href: `/${locale}/admin/settings` },
  ];

  return (
    <aside className="w-80 bg-[#12141C] border-r border-white/5 flex flex-col p-8 h-screen sticky top-0">
      <div className="flex items-center gap-3 mb-16 px-2">
        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary shadow-lg">
          <LayoutDashboard size={24} />
        </div>
        <span className="text-xl font-serif font-bold tracking-tight">
          Admin <span className="text-secondary">Abyss</span>
        </span>
      </div>

      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const isActive = activePath === item.href || (item.href !== `/${locale}/admin` && activePath.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? "bg-secondary text-primary font-bold shadow-lg" 
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-white/5 space-y-2">
        <Link 
          href={`/${locale}`} 
          className="flex items-center gap-3 px-4 py-3 text-white/40 hover:text-white transition-colors text-sm"
          target="_blank"
        >
          <ExternalLink size={18} />
          {t("viewWebsite")}
        </Link>
        <LogoutButton />
      </div>
    </aside>
  );
}
