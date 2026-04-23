"use client";
import { API_URL } from "@/config/api";

import { useState, useEffect } from "react";
import { X, Camera, UserPlus, Anchor, MoreHorizontal, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AddonModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: any;
  onSuccess: () => void;
}

export default function AddAddonModal({ isOpen, onClose, editData, onSuccess }: AddonModalProps) {
  const [formData, setFormData] = useState({
    name: { en: "", ar: "", ru: "", de: "" },
    price: 0,
    icon: "Camera",
  });
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (editData) {
      try {
        const parsedName = JSON.parse(editData.name);
        setFormData({
          name: parsedName,
          price: editData.price,
          icon: editData.icon,
        });
      } catch {
        setFormData({
          name: { en: editData.name, ar: "", ru: "", de: "" },
          price: editData.price,
          icon: editData.icon,
        });
      }
    } else {
      setFormData({
        name: { en: "", ar: "", ru: "", de: "" },
        price: 0,
        icon: "Camera",
      });
    }
  }, [editData, isOpen]);

  const handleMagicTranslate = async () => {
    if (!formData.name.en) return;
    setIsTranslating(true);
    try {
      const res = await fetch(`${API_URL}/api/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: formData.name.en,
          from: "en",
          targets: ["ar", "ru", "de"],
        }),
      });
      const translations = await res.json();
      setFormData(prev => ({
        ...prev,
        name: { ...prev.name, ...translations }
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editData 
      ? `${API_URL}/api/addons/${editData.id}` 
      : `${API_URL}/api/addons`;
    const method = editData ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          name: JSON.stringify(formData.name),
        }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const icons = [
    { name: "Camera", icon: Camera },
    { name: "UserPlus", icon: UserPlus },
    { name: "Anchor", icon: Anchor },
    { name: "MoreHorizontal", icon: MoreHorizontal },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-[#0F1117] rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden"
        >
          <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <div>
              <h2 className="text-3xl font-serif font-bold text-white">{editData ? "Edit Add-on" : "New Add-on"}</h2>
              <p className="text-white/40 mt-1">Configure your booking extra service.</p>
            </div>
            <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/5">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {/* Multi-language Name */}
            <div className="space-y-6 bg-white/5 p-8 rounded-3xl border border-white/5">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-black uppercase tracking-widest text-secondary">Service Name (Multilingual)</label>
                <button
                  type="button"
                  onClick={handleMagicTranslate}
                  disabled={!formData.name.en || isTranslating}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-secondary hover:text-primary transition-all disabled:opacity-30"
                >
                  <Sparkles size={14} className={isTranslating ? "animate-spin" : ""} />
                  {isTranslating ? "Translating..." : "Magic Translate"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">English</span>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-secondary outline-none transition-all"
                    placeholder="e.g. Underwater Photo"
                    value={formData.name.en}
                    onChange={(e) => setFormData({ ...formData, name: { ...formData.name, en: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Arabic</span>
                  <input 
                    type="text" 
                    dir="rtl"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-secondary outline-none transition-all font-arabic"
                    placeholder="مثال: تصوير تحت الماء"
                    value={formData.name.ar}
                    onChange={(e) => setFormData({ ...formData, name: { ...formData.name, ar: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Russian</span>
                  <input 
                    type="text" 
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-secondary outline-none transition-all"
                    value={formData.name.ru}
                    onChange={(e) => setFormData({ ...formData, name: { ...formData.name, ru: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">German</span>
                  <input 
                    type="text" 
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-secondary outline-none transition-all"
                    value={formData.name.de}
                    onChange={(e) => setFormData({ ...formData, name: { ...formData.name, de: e.target.value } })}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-secondary">Price ($)</label>
                <input 
                  type="number" 
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-secondary outline-none transition-all"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-secondary">Select Icon</label>
                <div className="flex gap-4">
                  {icons.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: item.name })}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all border ${
                        formData.icon === item.name 
                          ? "bg-secondary text-primary border-secondary shadow-lg shadow-secondary/20 scale-110" 
                          : "bg-white/5 text-white/40 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <item.icon size={20} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <button 
                type="button"
                onClick={onClose}
                className="px-8 py-4 rounded-2xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-12 py-4 rounded-2xl bg-secondary text-primary font-bold hover:bg-white transition-all shadow-2xl active:scale-95"
              >
                {editData ? "Update Add-on" : "Create Add-on"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
