"use client";
import { API_URL } from "@/config/api";

import { ArrowLeft, Mail, Trash2, Calendar, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string | Date;
}

export default function InquiriesClient({ initialInquiries, locale, t }: { initialInquiries: Inquiry[], locale: string, t: any }) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;

    try {
      const res = await fetch(`${API_URL}/api/inquiries/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-16">
      <header className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-6 mb-4">
            <Link href={`/${locale}/admin`} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/5">
              <ArrowLeft size={24} className="rtl:rotate-180" />
            </Link>
            <h1 className="text-4xl font-serif font-bold">{t.title}</h1>
          </div>
          <p className="text-white/40 text-lg">{t.subtitle}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-10">
        {initialInquiries.map((inquiry) => (
          <div key={inquiry.id} className="bg-[#12141C] p-12 rounded-[3rem] border border-white/5 shadow-2xl group hover:border-secondary/30 transition-all">
            <div className="flex justify-between items-start mb-10 pb-10 border-b border-white/5">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-secondary border border-white/5">
                  <User size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold group-hover:text-secondary transition-colors mb-1">{inquiry.name}</h3>
                  <p className="text-white/40 font-medium tracking-wide">{inquiry.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] flex items-center justify-end gap-2 mb-2">
                    <Calendar size={14} />
                    Received On
                  </span>
                  <p className="font-bold text-white/60">{new Date(inquiry.createdAt).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <button 
                  onClick={() => handleDelete(inquiry.id)}
                  className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl flex items-center justify-center border border-red-500/10 active:scale-90"
                >
                  <Trash2 size={24} />
                </button>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="inline-block px-5 py-2 bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-[0.2em] rounded-xl border border-secondary/20">
                Subject: {inquiry.subject}
              </div>
              <p className="text-xl text-white/70 leading-relaxed italic border-l-4 border-secondary/20 pl-10 rtl:border-l-0 rtl:border-r-4 rtl:pl-0 rtl:pr-10 font-serif">
                "{inquiry.message}"
              </p>
            </div>

            <div className="mt-12 flex justify-end">
              <a 
                href={`mailto:${inquiry.email}?subject=Re: ${inquiry.subject}`}
                className="flex items-center gap-3 px-10 py-5 bg-white/5 text-white font-black rounded-2xl hover:bg-secondary hover:text-primary transition-all text-sm uppercase tracking-widest shadow-xl border border-white/5 hover:border-secondary"
              >
                <Mail size={22} />
                Reply via Email
              </a>
            </div>
          </div>
        ))}

        {initialInquiries.length === 0 && (
          <div className="py-48 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[4rem] text-white/20 bg-white/[0.01]">
            <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center mb-8">
              <Mail size={48} strokeWidth={1} className="opacity-50" />
            </div>
            <p className="text-2xl font-serif">No inquiries yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
