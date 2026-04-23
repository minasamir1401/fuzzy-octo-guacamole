"use client";
import { API_URL } from "@/config/api";

import { LogOut } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function LogoutButton() {
  const router = useRouter();
  const { locale } = useParams();
  const t = useTranslations("admin.sidebar");

  const handleLogout = () => {
    // In a real app, you'd also hit an API route to clear the cookie
    document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push(`/${locale}/admin/login`);
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all w-full font-bold text-sm group"
    >
      <LogOut size={18} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
      {t("logout")}
    </button>
  );
}
