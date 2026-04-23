"use client";
import { API_URL } from "@/config/api";

import { CheckCircle, Clock, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface Booking {
  id: string;
  userName: string;
  userEmail: string;
  packageName: string;
  date: string | Date;
  status: string;
  totalPrice: number;
}

export default function RecentBookingsClient({ bookings, locale }: { bookings: Booking[], locale: string }) {
  const router = useRouter();
  const t = useTranslations("admin.dashboard.recentBookings.table");

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const res = await fetch(`${API_URL}/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left rtl:text-right border-collapse">
        <thead>
          <tr className="text-[10px] uppercase tracking-[0.2em] text-white/20 border-b border-white/5">
            <th className="px-10 py-8 font-black">{t("customer")}</th>
            <th className="px-10 py-8 font-black">{t("package")}</th>
            <th className="px-10 py-8 font-black">{t("date")}</th>
            <th className="px-10 py-8 font-black">{t("status")}</th>
            <th className="px-10 py-8 font-black">{t("price")}</th>
            <th className="px-10 py-8 font-black">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors group">
              <td className="px-10 py-7">
                <p className="font-bold text-lg group-hover:text-secondary transition-colors">{booking.userName}</p>
                <p className="text-xs text-white/40">{booking.userEmail}</p>
              </td>
              <td className="px-10 py-7">
                <span className="text-sm font-medium px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                  {booking.packageName}
                </span>
              </td>
              <td className="px-10 py-7 text-sm text-white/60">
                {new Date(booking.date).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })}
              </td>
              <td className="px-10 py-7">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] flex items-center gap-2 w-fit ${
                  booking.status === "PENDING" ? "bg-amber-500/10 text-amber-500" : 
                  booking.status === "CONFIRMED" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                }`}>
                  {booking.status === "PENDING" ? <Clock size={12} /> : <CheckCircle size={12} />}
                  {booking.status === "PENDING" ? t("pending") : t("confirmed")}
                </span>
              </td>
              <td className="px-10 py-7 font-bold text-secondary text-2xl">${booking.totalPrice}</td>
              <td className="px-10 py-7">
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {booking.status === "PENDING" && (
                    <button 
                      onClick={() => handleStatusUpdate(booking.id, "CONFIRMED")}
                      className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all"
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}
                  <button 
                    onClick={() => handleStatusUpdate(booking.id, "CANCELLED")}
                    className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {bookings.length === 0 && (
            <tr>
              <td colSpan={6} className="px-10 py-20 text-center text-white/20">
                No recent bookings
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
