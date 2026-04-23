"use client";
import { API_URL } from "@/config/api";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, User, ChevronRight, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function AdminLogin() {
  const t = useTranslations("admin.login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        setError(t("error"));
      }
    } catch (err) {
      setError(t("genericError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen liquid-gradient flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass p-10 rounded-[2.5rem] shadow-2xl relative z-10 border border-white/20">
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center text-primary shadow-xl mb-6">
              <ShieldCheck size={40} />
            </div>
            <h1 className="text-3xl font-serif font-bold text-white text-center leading-tight">
              {t("title")} <br />
              <span className="text-secondary italic text-2xl">{t("subtitle")}</span>
            </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/60 uppercase tracking-widest ml-1">{t("username")}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center text-white/40">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-secondary transition-all"
                  placeholder="admin_user"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/60 uppercase tracking-widest ml-1">{t("password")}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center text-white/40">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-secondary transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm font-bold text-center bg-red-400/10 py-2 rounded-lg"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 rounded-2xl bg-secondary text-primary font-bold shadow-xl hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {loading ? t("authenticating") : t("enter")}
              <ChevronRight size={20} className="rtl:rotate-180" />
            </button>
          </form>

          <p className="text-center text-white/40 text-[10px] mt-10 tracking-widest uppercase">
            {t("footer")}
          </p>
        </div>
      </motion.div>
    </main>
  );
}
