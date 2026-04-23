"use client";
import { API_URL } from "@/config/api";

import { motion } from "framer-motion";
import { Check, Waves, Star, Diamond, Shield, Anchor, Camera, Coffee } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";

const iconMap: Record<string, any> = {
  Waves,
  Star,
  Diamond,
  Shield,
  Anchor,
};

import { Package } from "@/types";

export default function PackagesClient({ initialPackages }: { initialPackages: Package[] }) {
  const t = useTranslations("packages");
  const locale = useLocale();

  return (
    <main className="min-h-screen pt-24">
      {/* Header Section */}
      <section className="py-24 px-6 bg-accent/30 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-secondary font-bold uppercase tracking-widest text-xs mb-4 block">{t("hero.badge")}</span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary mb-8 leading-tight">
            {t("hero.title1")} <span className="text-secondary italic">{t("hero.title2")}</span>
          </h1>
          <p className="text-lg text-primary/60">
            {t("hero.desc")}
          </p>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="bg-white/5 rounded-[3rem] border border-glass-border overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-primary/5 border-b border-glass-border">
                <tr>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-primary/40">Service</th>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-primary/40 hidden md:table-cell">Features</th>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-primary/40 text-center">{t("perPerson")}</th>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-primary/40 text-right">Book</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border">
                {initialPackages.map((plan, i) => {
                  const IconComponent = iconMap[plan.icon] || Waves;
                  
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

                  const name = parseSafe(plan.name, locale);
                  const description = parseSafe(plan.description, locale);
                  const features = parseArraySafe(plan.features, locale);
                  const excludedFeatures = parseArraySafe(plan.excludedFeatures, locale);

                  return (
                    <motion.tr
                      key={plan.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      viewport={{ once: true }}
                      className={`group hover:bg-secondary/5 transition-colors ${plan.isFeatured ? 'bg-secondary/[0.02]' : ''}`}
                    >
                      <td className="px-8 py-8">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <IconComponent size={14} className="text-secondary" />
                            <h3 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors">{name}</h3>
                          </div>
                          <p className="text-sm text-primary/40 font-medium mb-2">{plan.type}</p>
                          <p className="text-sm text-primary/60 max-w-sm line-clamp-1">{description}</p>
                        </div>
                      </td>
                      <td className="px-8 py-8 hidden md:table-cell">
                        <div className="flex flex-wrap gap-3 max-w-xs">
                          {features.slice(0, 3).map((f: string) => (
                            <div key={f} className="flex items-center gap-2 bg-secondary/10 px-3 py-1.5 rounded-xl border border-secondary/20">
                              <Check size={12} className="text-secondary" />
                              <span className="text-xs font-bold text-primary">{f}</span>
                            </div>
                          ))}
                          {features.length > 3 && (
                            <span className="text-xs font-bold text-primary/30">+{features.length - 3} more</span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-8 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-4xl font-bold text-primary">${plan.price}</span>
                          <span className="text-[10px] font-black text-primary/20 uppercase tracking-widest">{t("perPerson")}</span>
                        </div>
                      </td>
                      <td className="px-8 py-8 text-right">
                        <Link 
                          href={{ pathname: '/booking', query: { package: plan.id } }}
                          className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 whitespace-nowrap ${
                            plan.isFeatured 
                              ? "bg-secondary text-primary hover:bg-white" 
                              : "bg-primary text-white hover:bg-secondary hover:text-primary"
                          }`}
                        >
                          {t("bookPackage")}
                        </Link>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Comparison Details */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-serif font-bold text-primary text-center mb-16">All Packages Include</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { icon: Shield, text: "Insurance" },
            { icon: Anchor, text: "Full Safety Brief" },
            { icon: Coffee, text: "Refreshments" },
            { icon: Camera, text: "Site Photos" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full glass flex items-center justify-center text-secondary shadow-lg">
                <item.icon size={28} />
              </div>
              <span className="font-bold text-primary">{item.text}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
