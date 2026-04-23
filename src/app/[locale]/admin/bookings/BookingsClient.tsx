"use client";
import { API_URL } from "@/config/api";

import { ArrowLeft, Trash2, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface Booking {
  id: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  packageName: string;
  date: string | Date;
  guests: number;
  totalPrice: number;
  status: string;
}

export default function BookingsClient({ initialBookings, locale }: { initialBookings: Booking[], locale: string }) {
  const router = useRouter();
  const t = useTranslations("admin.bookings");

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
    <div className="max-w-7xl mx-auto space-y-12">
      <header className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-6 mb-4">
            <Link href={`/${locale}/admin`} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/5">
              <ArrowLeft size={24} className="rtl:rotate-180" />
            </Link>
            <h1 className="text-4xl font-serif font-bold">{t("title")}</h1>
          </div>
          <p className="text-white/40 text-lg">{t("subtitle")}</p>
        </div>
      </header>

      <div className="bg-[#12141C] rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.2em] text-white/20 border-b border-white/5 bg-white/[0.01]">
                <th className="px-10 py-8 font-black">{t("table.customer")}</th>
                <th className="px-10 py-8 font-black">{t("table.package")}</th>
                <th className="px-10 py-8 font-black">{t("table.guests")}</th>
                <th className="px-10 py-8 font-black">{t("table.totalPrice")}</th>
                <th className="px-10 py-8 font-black">{t("table.status")}</th>
                <th className="px-10 py-8 font-black">{t("table.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {initialBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-10 py-7">
                    <p className="font-bold text-lg group-hover:text-secondary transition-colors">{booking.userName}</p>
                    <p className="text-xs text-white/40 mt-1">{booking.userEmail}</p>
                    <p className="text-xs text-white/40">{booking.userPhone}</p>
                  </td>
                  <td className="px-10 py-7">
                    <p className="text-sm font-bold bg-white/5 border border-white/10 px-3 py-1 rounded-lg w-fit mb-2">
                      {booking.packageName}
                    </p>
                    <p className="text-xs text-secondary font-medium tracking-wide">
                      {new Date(booking.date).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </td>
                  <td className="px-10 py-7">
                    <span className="text-sm font-medium">{t("guests", { count: booking.guests })}</span>
                  </td>
                  <td className="px-10 py-7 font-bold text-secondary text-2xl">${booking.totalPrice}</td>
                  <td className="px-10 py-7">
                    <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-2 w-fit ${
                      booking.status === "PENDING" ? "bg-amber-500/10 text-amber-500" : 
                      booking.status === "CONFIRMED" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                    }`}>
                      {booking.status === "PENDING" ? <Clock size={14} /> : <CheckCircle size={14} />}
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-10 py-7">
                    <div className="flex gap-3">
                      {booking.status === "PENDING" && (
                        <button 
                          onClick={() => handleStatusUpdate(booking.id, "CONFIRMED")}
                          className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-xl active:scale-90 flex items-center justify-center" 
                          title={t("actions.confirm")}
                        >
                          <CheckCircle size={20} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleStatusUpdate(booking.id, "CANCELLED")}
                        className="w-11 h-11 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl active:scale-90 flex items-center justify-center" 
                        title={t("actions.cancel")}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {initialBookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-10 py-20 text-center text-white/20">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
