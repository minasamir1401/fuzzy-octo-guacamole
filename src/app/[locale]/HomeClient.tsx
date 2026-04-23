"use client";
import { API_URL } from "@/config/api";

import { motion } from "framer-motion";
import { ChevronRight, ShieldCheck, UserCheck, Star, ArrowRight, Waves } from "lucide-react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import StructuredData from "@/components/StructuredData";

interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  level: string;
  type: string;
  image: string;
  features: string;
  excludedFeatures: string;
  badge?: string | null;
  icon: string;
  isFeatured: boolean;
}

export default function HomeClient({ 
  initialPackages,
  pricingTable
}: { 
  initialPackages: Package[],
  pricingTable: React.ReactNode 
}) {
  const t = useTranslations();
  const locale = useLocale();

  const parseSafe = (str: string, lang: string) => {
    try {
      const parsed = JSON.parse(str);
      if (typeof parsed === 'object' && parsed !== null) {
        if (parsed[lang] !== undefined) return parsed[lang];
        if (parsed['en'] !== undefined) return parsed['en'];
        return Object.values(parsed)[0] || "";
      }
      return str;
    } catch (e) {
      return str;
    }
  };

  const parseArraySafe = (str: string, lang: string) => {
    try {
      const parsed = JSON.parse(str);
      if (Array.isArray(parsed)) return parsed;
      if (typeof parsed === 'object' && parsed !== null) {
        if (parsed[lang] !== undefined) return parsed[lang];
        if (parsed['en'] !== undefined) return parsed['en'];
        return Object.values(parsed)[0] || [];
      }
      return [];
    } catch (e) {
      return [];
    }
  };

  return (
    <main className="min-h-screen">
      <StructuredData />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-110"
          >
            <source src="/images/127713-739309133_medium.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-transparent to-primary/80" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full glass text-secondary text-sm font-bold mb-6 tracking-widest uppercase">
              {t("hero.badge")}
            </span>
            <h1 className="text-5xl md:text-[5rem] font-serif text-white font-bold leading-tight mb-8 drop-shadow-2xl">
              {t("hero.title1")} <br />
              <span className="text-secondary italic">{t("hero.title2")}</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              {t("hero.desc")}
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <Link
                href="/booking"
                className="px-10 py-5 rounded-full liquid-gradient text-white text-lg font-bold shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                {t("hero.cta1")}
                <ChevronRight size={24} />
              </Link>
              <Link
                href="/diving"
                className="px-10 py-5 rounded-full glass text-white text-lg font-bold shadow-2xl hover:bg-white/10 transition-all"
              >
                {t("hero.cta2")}
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60"
        >
          <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-secondary to-transparent" />
        </motion.div>
      </section>

      {/* Featured Packages Section */}
      <section className="py-32 px-6 bg-accent/30">
        <div className="max-w-[90rem] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 px-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-6">
                {t("featured.title")}
              </h2>
              <p className="text-lg text-primary/60">
                {t("featured.desc")}
              </p>
            </div>
            <Link href="/packages" className="group flex items-center gap-2 text-primary font-bold hover:text-secondary transition-colors">
              {t("featured.viewAll")} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="bg-white/5 rounded-[3rem] border border-glass-border overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-primary/5 border-b border-glass-border">
                  <tr>
                    <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-primary/40">{t("featured.package")}</th>
                    <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-primary/40 hidden md:table-cell">{t("featured.details")}</th>
                    <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-primary/40 text-center">{t("featured.price")}</th>
                    <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-primary/40 text-right">{t("featured.action")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-glass-border">
                  {initialPackages.map((pkg, i) => (
                    <motion.tr
                      key={pkg.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      viewport={{ once: true }}
                      className="group hover:bg-secondary/5 transition-colors"
                    >
                      <td className="px-8 py-8">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors">
                              {parseSafe(pkg.name, locale)}
                            </h3>
                            {pkg.badge && (
                              <span className="bg-secondary/20 text-secondary text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                                {pkg.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-primary/40 font-medium">{pkg.type}</p>
                          {/* Features chips — visible on mobile only */}
                          <div className="flex flex-wrap gap-2 mt-3 md:hidden">
                            {parseArraySafe(pkg.features, locale).slice(0, 3).map((f: string) => (
                              <div key={f} className="flex items-center gap-1.5 bg-secondary/10 px-3 py-1.5 rounded-xl border border-secondary/20">
                                <ShieldCheck size={12} className="text-secondary" />
                                <span className="text-xs font-bold text-primary">{f}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-8 hidden md:table-cell">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-secondary">
                            <span>{pkg.level}</span>
                            <span className="w-1.5 h-1.5 bg-secondary/30 rounded-full" />
                            <span>{pkg.duration}</span>
                          </div>
                          <div className="flex flex-wrap gap-3 mt-3">
                            {parseArraySafe(pkg.features, locale).slice(0, 3).map((f: string) => (
                              <div key={f} className="flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-xl border border-secondary/20">
                                <ShieldCheck size={16} className="text-secondary" />
                                <span className="text-sm font-bold text-primary">{f}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-8 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-3xl font-bold text-primary">${pkg.price}</span>
                          <span className="text-[10px] font-black text-primary/20 uppercase tracking-widest">{t("featured.perPerson")}</span>
                        </div>
                      </td>
                      <td className="px-8 py-8 text-right">
                        <Link
                          href={`/booking?package=${pkg.id}`}
                          className="inline-flex items-center gap-3 px-8 py-4 liquid-gradient rounded-xl text-white font-bold shadow-lg hover:shadow-secondary/20 transition-all active:scale-95 whitespace-nowrap"
                        >
                          {t("featured.selectCourse")}
                          <ArrowRight size={18} />
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-32 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkOPFDdwdezALn0Y10hKuW4trHycj2qcVkHaUKbxDtZYUFYlinzhNzVtS8HAhiZNHdTs9YNOT7PC0gjkgstlHUR5CrXAQ-g6S0tj4scqs6U5RXrVXr61f1INmi9lJmuGBe3M2mg0wLLbkOv2SkfFc8UJ57yxwQXjxxN-SNh8U3a6SSnTespqDTZeCoT1eC3o5fp8njMSKMClRuxaBFCfcyxRu0jZc8SJyeyVhQp5wPC1K-TCBjKh4TBVteCKgD66loE5ydEopaJLaq"
                alt="Professional Coaching"
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 liquid-gradient rounded-full blur-3xl opacity-20 -z-0" />
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-secondary rounded-full blur-3xl opacity-10 -z-0" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <span className="text-secondary font-bold uppercase tracking-widest text-sm">{t("why.badge")}</span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-primary leading-tight">
              {t("why.title1")} <span className="text-secondary italic">{t("why.title2")}</span>
            </h2>
            <p className="text-lg text-primary/60 leading-relaxed">
              {t("why.desc")}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
              {[
                { icon: UserCheck, key: "instructor" },
                { icon: ShieldCheck, key: "safety" },
                { icon: Star, key: "pace" },
                { icon: Waves, key: "sites" },
              ].map((feature, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl glass flex items-center justify-center text-secondary shrink-0 shadow-lg">
                    <feature.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary mb-1">{t(`why.features.${feature.key}.title`)}</h4>
                    <p className="text-sm text-primary/50">{t(`why.features.${feature.key}.desc`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-32 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTQn2skUOaPK_zmWuu48S2iake__kUPRWJG8ZKgIF4p0l8BVXxCSIFP22AYtO2IsddNw1m65RxIuqGAyp1JPxQ-ZZyGz8CrWXOYzATqZq_hDhPmKipmuNowSZ8h2aTom91FeQCRaQG23xd-4fFaTTEBTWvD_VQGpysi6sDBMiFZKdze3d2YTS_7WP8Ap-t2kbJo0tjiTAFFboN-a4GWU2YoglJq2VXPuB2t--fIBjrnDvrBjRwrtLFUSye-vyiF5AcayAw3QWgXbdv"
            alt="Pattern"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
            Witness the <span className="text-secondary italic">Underwater Oasis</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            A glimpse into the vibrant life beneath the surface. Each shot captured during our private expeditions.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 h-[600px] gap-2 px-2">
          {[
            "https://lh3.googleusercontent.com/aida-public/AB6AXuD4QzqRbXsd84jtQaXGUO50qTC6-cANrbZeWc5AUWCXktioVwnpasAR9lHz0JRnEDS5hz6tfadbqMuyWVducgu0onAaFtmx4Qm3W-xXdqgkOh8l6P9vJlbR2pmuEAF1EBQpyUS_2aUxh0O6olnG4AuRkciLuZowHcr_-Ggsx4mnpusPlJPIdEs5D7G3oyKwYVXrVFhB3RMjU6Q_s8CXQ_r_ytWHbVANCq3gAKkwK48etWivRIsucgSFghPorvNhr-d0uMklPZJq0ZTW",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBFpThi8ZvrsRoj1r6omXACOh2Mk1uwEA7NpMjM6_efR3tbB8X49zhS6G2J7XiZevD8cvGN1s_j1RZP8U7IwD-K3r-XAei03kSHVy_zk2e6g55mo0uwyFz9FxduKbttsXktv9hJvPmPBOzYHvEYhaanKCJUAMbDIQ1J47bEybKe_0l3E5t8QViVwMNq4-FNjteRxupeULt68loMoC4-2eC3jbhiJesfi7_in5DqpW9Ypd18-ozLg40iNnENdLNso5BAPVVKv6gKj3Hp",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCJHgKb0u7ciyA0aKymRztLAyEWHWvCHF6zoE_4oSJRAJnNQTx5WuZsKCnmvmFxuxMR7NI8h0EfO6NyAL5O54MmRvMnuI7Yedez0GWvaN0hjei__N_vBUhdE1uYSUnQyuuEKfDuxoNtdtUO1gCckjmOm-pQ9-tMGL1du86IAhy8A0Hu8L3GlF3dG2sB6mgNcQxDSOFoBRNPnvJb8NBKi5MLjbdQmgJ4G4S6KgT1BKMMBijHNTTb70h5k3wCkGpbHx3SwU_iWPUVe6q6",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBEYOkQFu4UUoyP2gK0EPss8_aDgFB4zxbPVAJvlP7iiMNiBkqcN6WAyZswqndZORXNkr6CP0xVfJYd2Z17y7t3ql9DpE9gjybmGiD0HvEc6P11s6LSovJcXHKjlIWS35BO5ldTgi5hmAb1VOMuiFQRRarcORzf9c6cCqz6Zg7bEBdlAiWdRBhsh7wSHuXgVzTts440mn-xmCtxsl-s81T1roFIQRV7vffjYT3HYl6BZyq6ZWuvDOhSXGrlcyPRMJghAkRQCc6fZZW4"
          ].map((img, i) => (
            <motion.div
              key={i}
              whileHover={{ flex: 2 }}
              className="relative flex-1 overflow-hidden cursor-pointer"
            >
              <img src={img} className="w-full h-full object-cover" alt="Gallery" />
              <div className="absolute inset-0 bg-primary/20 hover:bg-transparent transition-colors" />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-20">
          <Link href="/gallery" className="px-10 py-5 rounded-full border border-white/20 text-white font-bold hover:bg-white hover:text-primary transition-all">
            Enter Full Gallery
          </Link>
        </div>
      </section>

      {/* Pricing Table Section */}
      {pricingTable}

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto liquid-gradient rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-[5rem] font-serif font-bold mb-8 leading-tight">
              {t("cta.title")}
            </h2>
            <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
              {t("cta.desc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/booking" className="px-10 py-5 bg-white text-primary rounded-full text-lg font-bold shadow-xl hover:scale-105 transition-all">
                {t("cta.btn1")}
              </Link>
              <Link href="/contact" className="px-10 py-5 border border-white/30 rounded-full text-lg font-bold hover:bg-white/10 transition-all">
                {t("cta.btn2")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
