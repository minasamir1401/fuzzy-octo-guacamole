"use client";
import { API_URL } from "@/config/api";

import { Link } from "@/i18n/navigation";
import { Waves, Mail, Phone, MapPin, Globe, MessageCircle, Anchor } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className="bg-primary text-white pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-16">
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary shadow-lg">
              <Waves size={24} />
            </div>
            <span className="text-xl font-serif font-bold tracking-tight">
              Azure <span className="text-secondary">Abyss</span>
            </span>
          </Link>
          <p className="text-white/60 leading-relaxed">
            {t("footer.desc")}
          </p>
          <div className="flex gap-4">
            {[Globe, MessageCircle, Anchor].map((Icon, i) => (
              <Link key={i} href="/" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-secondary hover:text-primary transition-all">
                <Icon size={18} />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6">{t("footer.links")}</h4>
          <ul className="space-y-4">
            <li><Link href="/" className="text-white/60 hover:text-secondary transition-colors">{t("nav.home")}</Link></li>
            <li><Link href="/diving" className="text-white/60 hover:text-secondary transition-colors">{t("nav.diving")}</Link></li>
            <li><Link href="/packages" className="text-white/60 hover:text-secondary transition-colors">{t("nav.packages")}</Link></li>
            <li><Link href="/gallery" className="text-white/60 hover:text-secondary transition-colors">{t("nav.gallery")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6">{t("nav.contact")}</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-white/60">
              <MapPin size={20} className="text-secondary shrink-0" />
              <span>Sheraton St, Hurghada, Red Sea Governorate, Egypt</span>
            </li>
            <li className="flex items-center gap-3 text-white/60">
              <Phone size={20} className="text-secondary shrink-0" />
              <span>+20 123 456 7890</span>
            </li>
            <li className="flex items-center gap-3 text-white/60">
              <Mail size={20} className="text-secondary shrink-0" />
              <span>info@azureabyss.com</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6">{t("footer.newsletter")}</h4>
          <p className="text-white/60 mb-6">Subscribe to get the latest offers and updates.</p>
          <form className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary transition-colors"
            />
            <button className="liquid-gradient py-3 rounded-xl font-bold hover:opacity-90 transition-opacity">
              {t("footer.subscribe")}
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-white/40">
        <p>{t("footer.copyright")}</p>
        <div className="flex gap-8">
          <Link href="/" className="hover:text-white transition-colors">{t("footer.privacy")}</Link>
          <Link href="/" className="hover:text-white transition-colors">{t("footer.terms")}</Link>
        </div>
      </div>
    </footer>
  );
}
