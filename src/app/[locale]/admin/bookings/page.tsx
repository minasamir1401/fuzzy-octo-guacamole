import { API_URL } from "@/config/api";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "../components/Sidebar";
import BookingsClient from "./BookingsClient";

export default async function ManageBookings({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_session");

  if (!isAdmin) {
    redirect(`/${locale}/admin/login`);
  }

  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#0A0B10] text-white flex">
      <Sidebar locale={locale} activePath={`/${locale}/admin/bookings`} />

      <main className="flex-1 p-12 lg:p-16 overflow-y-auto">
        <BookingsClient 
          initialBookings={bookings.map(b => ({ ...b, date: b.date.toISOString() }))} 
          locale={locale} 
        />
      </main>
    </div>
  );
}
