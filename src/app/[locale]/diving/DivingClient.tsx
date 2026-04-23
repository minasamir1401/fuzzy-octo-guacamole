"use client";
import { API_URL } from "@/config/api";

import { motion } from "framer-motion";
import { ArrowRight, Filter, Info, Shield, Clock, Map, ChevronDown, CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

interface DivingClientProps {
  trips: any[];
}

export default function DivingClient({ trips }: DivingClientProps) {
  const t = useTranslations("diving");
  const common = useTranslations("common");

  return (
    <main className="min-h-screen bg-[#F9F9FC]">
      {/* Header with Background Image */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 scale-105"
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD2veh4yx8NOqq-sevn-ZODsLbi2Z0hcifYYtz-pYW28zFKTrM7_mzBk5TrvMRRNWC7pbhs-wKkwOHqJLtKRZbIy40B6NdmOYISLDPr9cYQCXy2xX_7o2dR9ivDEP9EMA2dLY3NNf8Dsblfry8b-HmR6XtVNLs_aA9l8x4EyI-6uRq6hvl7F6YqM3kD4FlXyHLwLcVrKhSJ6QsbZ5xy54Cmit3Kj7l668S0UgpNuM2SpVdBzyj79ZsxDRrSFajnBVm3NUqZAnZPnbDt')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-[#F9F9FC] z-10" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 px-6 text-center max-w-4xl mx-auto"
        >
          <span className="text-secondary font-bold uppercase tracking-widest text-xs mb-4 block drop-shadow-md">{t("hero.badge")}</span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 leading-tight drop-shadow-xl">
            {t("hero.title1")} <span className="text-secondary italic">{t("hero.title2")}</span>
          </h1>
          <p className="text-lg text-white/90 leading-relaxed drop-shadow-lg font-medium">
            {t("hero.desc")}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/60 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={24} />
          </motion.div>
        </motion.div>
      </section>

      {/* Filters & Content */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 bg-white p-6 rounded-2xl shadow-sm border border-glass-border">
          <div className="flex items-center gap-4 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-primary shrink-0">
              <Filter size={18} />
            </div>
            <span className="font-bold text-primary shrink-0">{t("filter")}</span>
            <div className="flex gap-2">
              {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
                <button key={level} className="px-4 py-2 rounded-full border border-glass-border text-sm hover:bg-primary hover:text-white transition-all whitespace-nowrap">
                  {level}
                </button>
              ))}
            </div>
          </div>
          <p className="text-sm text-primary/40 whitespace-nowrap">Showing {trips.length} exclusive trips</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {trips.map((trip, i) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-glass-border hover:shadow-2xl transition-all"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img src={trip.image} alt={trip.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full text-xs font-bold text-primary flex items-center gap-1">
                  <Map size={14} /> {trip.location}
                </div>
                <div className="absolute bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-xl font-bold text-lg">
                  {trip.price}
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-secondary uppercase tracking-wider bg-secondary/10 px-3 py-1 rounded-full">
                    <Shield size={12} /> {trip.level}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary/40 uppercase tracking-wider">
                    <Clock size={12} /> {trip.duration}
                  </div>
                </div>
                <h3 className="text-2xl font-serif font-bold text-primary mb-6 group-hover:text-secondary transition-colors">
                  {trip.name}
                </h3>
                <div className="flex gap-3">
                  <Link 
                    href="/booking" 
                    className="flex-1 py-4 liquid-gradient text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
                  >
                    {t("book")}
                  </Link>
                  <button className="w-14 flex items-center justify-center rounded-xl border border-glass-border text-primary hover:bg-accent transition-colors">
                    <Info size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SEO Content Section - CRITICAL FOR GOOGLE PAGE 1 */}
      <section className="bg-white py-32 px-6 border-t border-glass-border">
        <div className="max-w-4xl mx-auto prose prose-lg prose-primary">
          <h2 className="text-4xl font-serif font-bold text-primary mb-8">{t("seo.heading1")}</h2>
          <p className="text-primary/70 leading-relaxed mb-6">
            {t("seo.p1")}
          </p>
          <p className="text-primary/70 leading-relaxed mb-12">
            Whether you're looking for the famous <strong>Giftun Island</strong> masterclass, the thrill of <strong>wreck diving at Abu Nuhas</strong>, or a calm <strong>beginner's discovery dive</strong>, Hurghada provides the perfect backdrop. Our private instruction ensures you aren't just another face in a large group, but a student receiving dedicated mastery training.
          </p>

          <h3 className="text-2xl font-serif font-bold text-primary mb-6">{t("seo.heading2")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {[
              { name: "Small Giftun", desc: "A vibrant reef plateau perfect for drift diving and spotting eagle rays." },
              { name: "Abu Ramada", desc: "Known as 'The Aquarium' for its incredible density of marine life." },
              { name: "Elphinstone Reef", desc: "For advanced divers seeking oceanic whitetip sharks and deep walls." },
              { name: "Thistlegorm Wreck", desc: "A world-class WWII shipwreck accessible from Hurghada for elite expeditions." }
            ].map((site, i) => (
              <div key={i} className="flex gap-4 items-start p-4 bg-accent/20 rounded-xl">
                <CheckCircle2 className="text-secondary shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-primary">{site.name}</h4>
                  <p className="text-sm text-primary/60">{site.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-3xl font-serif font-bold text-primary mb-8">{t("seo.heading3")}</h2>
          <div className="space-y-6">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="border-b border-glass-border pb-6">
                <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                  <span className="text-secondary">Q:</span> {t(`seo.faq.${i}.q`)}
                </h4>
                <p className="text-primary/60 text-sm italic">
                  <span className="font-bold text-primary/40">A:</span> {t(`seo.faq.${i}.a`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
