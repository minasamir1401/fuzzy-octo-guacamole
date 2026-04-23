"use client";
import { API_URL } from "@/config/api";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ContactPage() {
  const t = useTranslations("contact");
  
  return (
    <main className="min-h-screen pt-24 bg-[#F9F9FC]">
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full liquid-gradient opacity-5 -skew-x-12 translate-x-1/3" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10">
          <div>
            <span className="text-secondary font-bold uppercase tracking-widest text-xs mb-4 block">{t("hero.badge")}</span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary mb-8 leading-tight">
              {t("hero.title1")} <span className="text-secondary italic">{t("hero.title2")}</span>
            </h1>
            <p className="text-lg text-primary/60 mb-12 leading-relaxed">
              Have questions about our expeditions? Our luxury concierge team is available 24/7 to help you plan your perfect underwater journey.
            </p>

            <div className="space-y-8">
              {[
                { icon: MapPin, title: "Our Location", detail: "Sheraton St, Hurghada, Red Sea, Egypt" },
                { icon: Phone, title: "Direct Line", detail: "+20 123 456 7890" },
                { icon: Mail, title: "Email Support", detail: "concierge@redsealuxury.com" },
                { icon: Clock, title: "Operating Hours", detail: "Daily: 08:00 AM - 10:00 PM" },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start group">
                  <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-secondary shadow-lg group-hover:bg-secondary group-hover:text-primary transition-all">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary mb-1">{item.title}</h4>
                    <p className="text-primary/60">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 p-8 glass rounded-[2rem] border-secondary/20 flex items-center justify-between shadow-2xl">
              <div>
                <h4 className="font-bold text-primary text-xl mb-2">Prefer WhatsApp?</h4>
                <p className="text-primary/60 text-sm">Instant replies from our team.</p>
              </div>
              <a 
                href="https://wa.me/201234567890" 
                target="_blank"
                className="w-16 h-16 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
              >
                <MessageCircle size={32} />
              </a>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl border border-glass-border"
          >
            <h2 className="text-3xl font-serif font-bold text-primary mb-8">Send a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary/40 uppercase">{t("form.name")}</label>
                  <input type="text" className="w-full p-4 rounded-xl border border-glass-border focus:border-secondary outline-none transition-all" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary/40 uppercase">{t("form.email")}</label>
                  <input type="email" className="w-full p-4 rounded-xl border border-glass-border focus:border-secondary outline-none transition-all" placeholder="your@email.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-primary/40 uppercase">Subject</label>
                <select className="w-full p-4 rounded-xl border border-glass-border focus:border-secondary outline-none transition-all bg-white">
                  <option>Booking Inquiry</option>
                  <option>Special Packages</option>
                  <option>Private Yacht Charter</option>
                  <option>Technical Diving</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-primary/40 uppercase">Message</label>
                <textarea rows={5} className="w-full p-4 rounded-xl border border-glass-border focus:border-secondary outline-none transition-all" placeholder="How can we help you?"></textarea>
              </div>
              <button className="w-full py-5 liquid-gradient text-white rounded-2xl font-bold shadow-xl flex items-center justify-center gap-3 hover:opacity-90 transition-opacity">
                {t("form.send")} <Send size={20} />
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="h-[500px] bg-primary/5 px-6 pb-20">
        <div className="max-w-7xl mx-auto h-full rounded-[3rem] overflow-hidden shadow-2xl relative">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8bFSVNvJuEHAmUB_m5F4VUd1giOu-P8uI_7ie3QJTG-jEsZbjRVfOjehURH_HnpG5ArbPQ7bM76Ite6piF1GJCghZ0jr_Oq7pQIVaXFrocrksKi00uBU3YoynGjczdvPaBDjj4rUivsPxiYv3BENoiRsTRzRMvcEgXjnNepiMAMZnWY-8oh0D6Axs3tTcklPtEz43LcVGc0hqoiAK3zvPoe2W8222avyJxF23989IRFQTTYXXjy4Lfg6wHY5iFzQI0by5nU5vMHAy"
            className="w-full h-full object-cover"
            alt="Map Location"
          />
          <div className="absolute inset-0 bg-primary/20 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass p-8 rounded-full shadow-2xl flex flex-col items-center">
            <div className="w-12 h-12 liquid-gradient rounded-full flex items-center justify-center text-white mb-2 animate-bounce shadow-lg">
              <MapPin size={24} />
            </div>
            <span className="font-bold text-primary text-sm uppercase tracking-widest">Visit Us In Hurghada</span>
          </div>
        </div>
      </section>
    </main>
  );
}
