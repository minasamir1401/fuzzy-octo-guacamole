"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Waves, Menu, X, Languages, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";

const navLinks = [
  { name: "nav.home", href: "/" },
  { name: "nav.diving", href: "/diving" },
  { name: "nav.packages", href: "/packages" },
  { name: "nav.gallery", href: "/gallery" },
  { name: "nav.contact", href: "/contact" },
];

export default function Navbar({ showPackagesPage = true }: { showPackagesPage?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "ar", name: "العربية", flag: "🇪🇬" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
  ];

  const switchLanguage = (newLocale: string) => {
    router.replace(pathname as any, { locale: newLocale as any });
    setShowLangMenu(false);
  };

  const visibleLinks = navLinks.filter(l => showPackagesPage || l.name !== "nav.packages");

  return (
    <>
      {/* ===== DESKTOP NAVBAR (TOP) ===== */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 rounded-full glass shadow-2xl">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 liquid-gradient rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              <Waves size={24} />
            </div>
            <span className="text-2xl font-serif font-bold tracking-tight text-primary">
              Azure <span className="text-secondary">Abyss</span>
            </span>
          </Link>

          <div className="flex items-center gap-8">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href as any}
                className={cn(
                  "text-base font-bold transition-colors hover:text-secondary relative group",
                  pathname === link.href ? "text-secondary" : "text-primary"
                )}
              >
                {t(link.name)}
                {pathname === link.href && (
                  <motion.div
                    layoutId="activeTabDesktop"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-secondary"
                  />
                )}
              </Link>
            ))}

            {/* Language Switcher Desktop */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-full transition-all border border-transparent hover:border-glass-border text-primary"
              >
                <Languages size={20} />
                <span className="text-sm font-black uppercase">{locale}</span>
              </button>
              <AnimatePresence>
                {showLangMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-4 glass p-3 rounded-2xl shadow-2xl min-w-[160px] z-50 border border-glass-border"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => switchLanguage(lang.code)}
                        className={cn(
                          "w-full flex items-center gap-3 px-5 py-3 rounded-xl text-base font-bold hover:bg-primary/5 transition-colors text-primary",
                          locale === lang.code && "bg-secondary/10 text-secondary"
                        )}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/booking"
              className="px-8 py-3 rounded-full liquid-gradient text-white text-base font-black shadow-lg hover:shadow-secondary/20 hover:scale-105 transition-all uppercase tracking-widest"
            >
              {t("nav.bookNow")}
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== MOBILE BOTTOM NAVBAR ===== */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-3">
        <div className="glass rounded-3xl shadow-2xl border border-glass-border overflow-hidden">

          {/* Expanded menu (opens upward) */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-b border-glass-border"
              >
                <div className="px-4 py-4 flex flex-col gap-3">
                  {/* Language Switcher Mobile */}
                  <div className="flex gap-2 justify-center mb-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => switchLanguage(lang.code)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold transition-all",
                          locale === lang.code
                            ? "bg-secondary/20 text-secondary ring-1 ring-secondary"
                            : "text-primary/50 hover:text-primary"
                        )}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.code.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>

                  {/* All nav links */}
                  <div className="grid grid-cols-2 gap-2">
                    {visibleLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href as any}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "px-4 py-3 rounded-xl font-bold text-sm text-center transition-all",
                          pathname === link.href
                            ? "bg-secondary/15 text-secondary border border-secondary/30"
                            : "bg-primary/5 text-primary hover:bg-primary/10"
                        )}
                      >
                        {t(link.name)}
                      </Link>
                    ))}
                  </div>

                  {/* Book Now CTA */}
                  <Link
                    href="/booking"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-4 liquid-gradient text-white rounded-2xl font-black text-center shadow-lg uppercase tracking-widest text-sm"
                  >
                    {t("nav.bookNow")}
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main bottom bar — Menu button only */}
          <div className="flex items-center justify-between px-5 py-3">
            <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
              <div className="w-8 h-8 liquid-gradient rounded-full flex items-center justify-center text-white shadow">
                <Waves size={16} />
              </div>
              <span className="font-serif font-bold text-primary text-base">
                Azure <span className="text-secondary">Abyss</span>
              </span>
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-glass-border text-primary font-bold text-sm transition-all hover:bg-secondary/10"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
              <span>{isOpen ? "Close" : "Menu"}</span>
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
