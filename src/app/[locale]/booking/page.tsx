"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "@/config/api";
import { ChevronRight, ChevronLeft, Calendar, Users, CheckCircle2, Waves, CreditCard, Camera, UserPlus, Anchor, MoreHorizontal } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  type: string;
}

export default function BookingPage() {
  const t = useTranslations("bookingPage");
  const locale = useLocale();
  const [packages, setPackages] = useState<Package[]>([]);
  const [addons, setAddons] = useState<any[]>([]);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    packageId: "",
    packageName: "",
    date: "",
    guests: 1,
    userName: "",
    userEmail: "",
    userPhone: "",
    selectedAddons: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/packages`)
      .then(res => res.json())
      .then(data => setPackages(data))
      .catch(err => console.error("Error fetching packages:", err));

    fetch(`${API_URL}/api/addons`)
      .then(res => res.json())
      .then(data => setAddons(data))
      .catch(err => console.error("Error fetching addons:", err));
  }, []);

  const parseSafe = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      return parsed[locale] || parsed.en || "Unnamed";
    } catch {
      return jsonStr;
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Camera": return Camera;
      case "UserPlus": return UserPlus;
      case "Anchor": return Anchor;
      default: return MoreHorizontal;
    }
  };

  const selectedPackage = packages.find(p => p.id === formData.packageId);
  const basePrice = selectedPackage ? selectedPackage.price * formData.guests : 0;
  const addonsPrice = formData.selectedAddons.reduce((acc, id) => {
    const addon = addons.find(a => a.id === id);
    return acc + (addon ? addon.price : 0);
  }, 0);
  const totalPrice = basePrice + addonsPrice;

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          totalPrice,
          addons: {
            photo: formData.selectedAddons.includes("photo"),
            private: formData.selectedAddons.includes("private"),
            gear: formData.selectedAddons.includes("gear"),
          }
        }),
      });
      if (res.ok) {
        setIsSuccess(true);
        setStep(4);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F9F9FC]">
      <Navbar />
      
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-12 relative">
            <div className="flex justify-between items-center relative z-10">
              {[1, 2, 3].map((s) => (
                <div 
                  key={s}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500",
                    step >= s ? "liquid-gradient text-white shadow-lg" : "bg-white text-primary/30 border border-glass-border"
                  )}
                >
                  {step > s ? <CheckCircle2 size={20} /> : s}
                </div>
              ))}
            </div>
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-glass-border -translate-y-1/2 -z-0">
              <motion.div 
                className="h-full bg-secondary"
                initial={{ width: "0%" }}
                animate={{ width: `${((step - 1) / 2) * 100}%` }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center mb-10">
                  <h1 className="text-4xl font-serif font-bold text-primary mb-2">{t("selectPackage.title")}</h1>
                  <p className="text-primary/60">{t("selectPackage.subtitle")}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {packages.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => setFormData({ ...formData, packageId: pkg.id, packageName: parseSafe(pkg.name) })}
                      className={cn(
                        "p-6 rounded-2xl border-2 text-left transition-all hover:shadow-lg",
                        formData.packageId === pkg.id 
                          ? "border-secondary bg-secondary/5 shadow-inner" 
                          : "border-glass-border bg-white"
                      )}
                    >
                      <div className="w-12 h-12 rounded-xl glass flex items-center justify-center text-secondary mb-6">
                        <Waves size={24} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-primary/40 mb-2 block">{t("selectPackage.type")}</span>
                      <h3 className="text-lg font-bold text-primary mb-2">{parseSafe(pkg.name)}</h3>
                      <p className="text-2xl font-bold text-secondary">${pkg.price}</p>
                    </button>
                  ))}
                </div>

                <div className="flex justify-end pt-8">
                  <button
                    disabled={!formData.packageId}
                    onClick={handleNext}
                    className="px-10 py-4 rounded-xl liquid-gradient text-white font-bold shadow-xl disabled:opacity-50 disabled:grayscale transition-all flex items-center gap-2"
                  >
                    {t("buttons.next")} <ChevronRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center mb-10">
                  <h2 className="text-4xl font-serif font-bold text-primary mb-2">{t("planVisit.title")}</h2>
                  <p className="text-primary/60">{t("planVisit.subtitle")}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-primary/60 uppercase tracking-widest flex items-center gap-2">
                      <Calendar size={16} /> {t("planVisit.date")}
                    </label>
                    <input 
                      type="date" 
                      className="w-full p-4 rounded-xl border border-glass-border bg-white focus:outline-none focus:border-secondary transition-all"
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      value={formData.date}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-primary/60 uppercase tracking-widest flex items-center gap-2">
                      <Users size={16} /> {t("planVisit.guests")}
                    </label>
                    <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-glass-border">
                      <button 
                        onClick={() => setFormData({ ...formData, guests: Math.max(1, formData.guests - 1) })}
                        className="w-10 h-10 rounded-lg glass flex items-center justify-center font-bold"
                      >-</button>
                      <span className="flex-1 text-center font-bold text-xl">{formData.guests}</span>
                      <button 
                        onClick={() => setFormData({ ...formData, guests: formData.guests + 1 })}
                        className="w-10 h-10 rounded-lg glass flex items-center justify-center font-bold"
                      >+</button>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-6">
                  <label className="text-sm font-bold text-primary/60 uppercase tracking-widest block">{t("planVisit.addonsTitle")}</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {addons.map((addon) => (
                      <button
                        key={addon.id}
                        onClick={() => {
                          const exists = formData.selectedAddons.includes(addon.id);
                          setFormData({
                            ...formData,
                            selectedAddons: exists 
                              ? formData.selectedAddons.filter(id => id !== addon.id)
                              : [...formData.selectedAddons, addon.id]
                          });
                        }}
                        className={cn(
                          "p-4 rounded-xl border flex flex-col items-center gap-3 transition-all",
                          formData.selectedAddons.includes(addon.id)
                            ? "border-secondary bg-secondary/5"
                            : "border-glass-border bg-white"
                        )}
                      >
                        {(() => {
                          const Icon = getIcon(addon.icon);
                          return <Icon size={24} className={formData.selectedAddons.includes(addon.id) ? "text-secondary" : "text-primary/20"} />;
                        })()}
                        <div className="text-center">
                          <p className="text-sm font-bold text-primary">{parseSafe(addon.name)}</p>
                          <p className="text-xs text-secondary">+${addon.price}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-8">
                  <button onClick={handleBack} className="px-8 py-4 rounded-xl border border-glass-border font-bold flex items-center gap-2">
                    <ChevronLeft size={20} /> {t("buttons.back")}
                  </button>
                  <button
                    disabled={!formData.date}
                    onClick={handleNext}
                    className="px-10 py-4 rounded-xl liquid-gradient text-white font-bold shadow-xl transition-all flex items-center gap-2"
                  >
                    {t("buttons.continueCheckout")} <ChevronRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-10"
              >
                <div className="md:col-span-2 space-y-8">
                  <div className="bg-white p-8 rounded-2xl border border-glass-border shadow-sm">
                    <h2 className="text-2xl font-serif font-bold text-primary mb-6">{t("contactInfo.title")}</h2>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-primary/40 uppercase">{t("contactInfo.name")}</label>
                          <input 
                            type="text" 
                            className="w-full p-4 rounded-xl border border-glass-border bg-white focus:border-secondary outline-none"
                            placeholder={t("contactInfo.namePlaceholder")}
                            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                            value={formData.userName}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-primary/40 uppercase">{t("contactInfo.email")}</label>
                          <input 
                            type="email" 
                            className="w-full p-4 rounded-xl border border-glass-border bg-white focus:border-secondary outline-none"
                            placeholder={t("contactInfo.emailPlaceholder")}
                            onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                            value={formData.userEmail}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-primary/40 uppercase">{t("contactInfo.phone")}</label>
                        <input 
                          type="tel" 
                          className="w-full p-4 rounded-xl border border-glass-border bg-white focus:border-secondary outline-none"
                          placeholder={t("contactInfo.phonePlaceholder")}
                          onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
                          value={formData.userPhone}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-2xl border border-glass-border shadow-sm">
                    <h2 className="text-2xl font-serif font-bold text-primary mb-6">{t("payment.title")}</h2>
                    <div className="p-4 border-2 border-secondary bg-secondary/5 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <CreditCard className="text-secondary" />
                        </div>
                        <div>
                          <p className="font-bold text-primary">{t("payment.securePayment")}</p>
                          <p className="text-xs text-primary/60">{t("payment.payLater")}</p>
                        </div>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-white">
                        <CheckCircle2 size={16} />
                      </div>
                    </div>
                    <p className="text-xs text-primary/40 mt-4 italic">{t("payment.note")}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-primary text-white p-8 rounded-2xl shadow-xl sticky top-32">
                    <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">{t("summary.title")}</h3>
                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">{t("summary.package")}</span>
                        <span className="font-bold">{formData.packageName}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">{t("summary.date")}</span>
                        <span className="font-bold">{formData.date}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">{t("summary.guests")}</span>
                        <span className="font-bold">{formData.guests}</span>
                      </div>
                      {formData.selectedAddons.length > 0 && (
                        <div className="pt-4 border-t border-white/10">
                          <p className="text-xs font-bold text-secondary uppercase mb-2">{t("summary.addons")}</p>
                          {formData.selectedAddons.map(id => {
                            const addon = addons.find(a => a.id === id);
                            return (
                              <div key={id} className="flex justify-between text-xs mb-1">
                                <span>{addon ? parseSafe(addon.name) : ""}</span>
                                <span>+${addon?.price || 0}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-end border-t border-white/20 pt-6">
                      <span className="text-lg">{t("summary.total")}</span>
                      <span className="text-3xl font-bold text-secondary">${totalPrice}</span>
                    </div>
                    <button
                      disabled={!formData.userName || !formData.userEmail || isSubmitting}
                      onClick={handleSubmit}
                      className="w-full mt-8 py-4 bg-secondary text-primary rounded-xl font-bold shadow-lg hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? t("summary.processing") : t("summary.confirmBtn")}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 space-y-8"
              >
                <div className="w-24 h-24 liquid-gradient rounded-full flex items-center justify-center text-white mx-auto shadow-2xl animate-bounce">
                  <CheckCircle2 size={48} />
                </div>
                <div>
                  <h2 className="text-5xl font-serif font-bold text-primary mb-4">{t("success.title")}</h2>
                  <p className="text-xl text-primary/60 max-w-lg mx-auto leading-relaxed">
                    {t("success.p1")}, <span className="font-bold text-secondary">{formData.userName}</span>. {t("success.p2")} <span className="font-bold">{formData.userEmail}</span>.
                  </p>
                </div>
                <div className="pt-10 flex gap-4 justify-center">
                  <Link href="/" className="px-8 py-4 rounded-xl bg-primary text-white font-bold shadow-lg">{t("success.homeBtn")}</Link>
                  <Link href="/gallery" className="px-8 py-4 rounded-xl border border-glass-border text-primary font-bold">{t("success.exploreBtn")}</Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </main>
  );
}
