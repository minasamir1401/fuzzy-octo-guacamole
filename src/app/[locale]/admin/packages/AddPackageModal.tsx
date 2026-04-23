"use client";
import { API_URL } from "@/config/api";

import { useState, useEffect } from "react";
import { X, Image as ImageIcon, Check, ListPlus, ListX, Star, Globe, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const LANGUAGES = [
  { code: "ar", label: "العربية", flag: "🇪🇬" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

interface TranslatableString {
  [key: string]: string;
}

import { Package } from "@/types";

interface AddPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: Package | null;
  onSuccess?: (pkg: Package) => void;
}

export default function AddPackageModal({ isOpen, onClose, editData, onSuccess }: AddPackageModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("ar");

  // Multi-language states
  const [names, setNames] = useState<TranslatableString>({ ar: "", en: "", de: "", ru: "" });
  const [descriptions, setDescriptions] = useState<TranslatableString>({ ar: "", en: "", de: "", ru: "" });
  const [featuresStrings, setFeaturesStrings] = useState<TranslatableString>({ ar: "", en: "", de: "", ru: "" });
  const [excludedStrings, setExcludedStrings] = useState<TranslatableString>({ ar: "", en: "", de: "", ru: "" });

  const [commonData, setCommonData] = useState({
    price: "",
    duration: "3 Hours",
    level: "Beginner",
    type: "Diving",
    image: "",
    badge: "",
    icon: "Waves",
    isFeatured: false,
  });

  const handleAutoTranslate = async () => {
    const textToTranslate = names[activeTab];
    const descToTranslate = descriptions[activeTab];
    const featuresToTranslate = featuresStrings[activeTab];
    const excludedToTranslate = excludedStrings[activeTab];

    if (!textToTranslate && !descToTranslate) {
      alert("Please enter text in the current language first.");
      return;
    }

    setLoading(true);
    try {
      const targets = LANGUAGES.map(l => l.code);
      
      const translateField = async (text: string) => {
        if (!text) return {};
        const res = await fetch(`${API_URL}/api/translate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, from: activeTab, targets })
        });
        return res.json();
      };

      const [nameRes, descRes, featRes, exclRes] = await Promise.all([
        translateField(textToTranslate),
        translateField(descToTranslate),
        translateField(featuresToTranslate),
        translateField(excludedToTranslate),
      ]);

      setNames(prev => ({ ...prev, ...nameRes }));
      setDescriptions(prev => ({ ...prev, ...descRes }));
      setFeaturesStrings(prev => ({ ...prev, ...featRes }));
      setExcludedStrings(prev => ({ ...prev, ...exclRes }));
      
    } catch (err) {
      console.error(err);
      alert("Translation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editData && isOpen) {
      const parseSafe = (str: string) => {
        try {
          const parsed = JSON.parse(str);
          if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
            return parsed;
          }
          // If it's an array or not an object, treat as default for all langs
          return { en: str, ar: str, de: str, ru: str };
        } catch (e) {
          return { en: str, ar: str, de: str, ru: str };
        }
      };

      const parsedNames = parseSafe(editData.name);
      const parsedDescs = parseSafe(editData.description);
      
      const featuresRaw = editData.features;
      const excludedRaw = editData.excludedFeatures;

      const parseArraySafe = (str: string) => {
        try {
          const parsed = JSON.parse(str);
          if (Array.isArray(parsed)) return { en: parsed, ar: parsed, de: parsed, ru: parsed };
          if (typeof parsed === 'object' && parsed !== null) return parsed;
          return { en: [], ar: [], de: [], ru: [] };
        } catch (e) {
          return { en: [], ar: [], de: [], ru: [] };
        }
      };

      const parsedFeatures = parseArraySafe(featuresRaw);
      const parsedExcluded = parseArraySafe(excludedRaw);

      setNames(parsedNames);
      setDescriptions(parsedDescs);
      
      const fStrings: any = {};
      const eStrings: any = {};
      LANGUAGES.forEach(lang => {
        const fArr = parsedFeatures[lang.code] || [];
        const eArr = parsedExcluded[lang.code] || [];
        fStrings[lang.code] = Array.isArray(fArr) ? fArr.join(", ") : "";
        eStrings[lang.code] = Array.isArray(eArr) ? eArr.join(", ") : "";
      });
      setFeaturesStrings(fStrings);
      setExcludedStrings(eStrings);

      setCommonData({
        price: String(editData.price),
        duration: editData.duration,
        level: editData.level,
        type: editData.type,
        image: editData.image,
        badge: editData.badge || "",
        icon: editData.icon,
        isFeatured: editData.isFeatured,
      });
    }
 else {
      setNames({ ar: "", en: "", de: "", ru: "" });
      setDescriptions({ ar: "", en: "", de: "", ru: "" });
      setFeaturesStrings({ ar: "", en: "", de: "", ru: "" });
      setExcludedStrings({ ar: "", en: "", de: "", ru: "" });
      setCommonData({
        price: "",
        duration: "3 Hours",
        level: "Beginner",
        type: "Diving",
        image: "",
        badge: "",
        icon: "Waves",
        isFeatured: false,
      });
    }
  }, [editData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const finalFeatures: any = {};
    const finalExcluded: any = {};
    LANGUAGES.forEach(lang => {
      // Split by comma OR newline
      finalFeatures[lang.code] = featuresStrings[lang.code].split(/[,\n]/).map(f => f.trim()).filter(f => f !== "");
      finalExcluded[lang.code] = excludedStrings[lang.code].split(/[,\n]/).map(f => f.trim()).filter(f => f !== "");
    });

    // Validation
    const parsedPrice = commonData.price === "" ? 0 : parseFloat(String(commonData.price));
    if (isNaN(parsedPrice)) {
      alert("Please enter a valid price or leave it empty for $0");
      setLoading(false);
      return;
    }

    // Build explicit payload with only fields accepted by the database schema
    const payload = {
      name: JSON.stringify(names),
      description: JSON.stringify(descriptions),
      features: JSON.stringify(finalFeatures),
      excludedFeatures: JSON.stringify(finalExcluded),
      price: parsedPrice,
      duration: commonData.duration,
      level: commonData.level,
      type: commonData.type,
      image: commonData.image,
      badge: commonData.badge || null,
      icon: commonData.icon,
      isFeatured: commonData.isFeatured,
    };

    try {
      const url = editData 
        ? `${API_URL}/api/packages/${editData.id}` 
        : `${API_URL}/api/packages`;
      
      const method = editData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const savedPackage = await res.json();
        onClose();
        if (onSuccess) onSuccess(savedPackage);
        router.refresh();
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error || "Failed to save package"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Network Error: Could not connect to the backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-md" 
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl bg-[#12141C] border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                <Globe size={24} />
              </div>
              <h2 className="text-2xl font-serif font-bold">
                <span>{editData ? "Edit Multilingual Package" : "Add Multilingual Package"}</span>
              </h2>
            </div>
            <button onClick={onClose} className="p-3 rounded-2xl hover:bg-white/5 text-white/40 hover:text-white transition-all">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
            {/* Language Tabs */}
            <div className="flex bg-white/5 p-1.5 rounded-2xl gap-1">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setActiveTab(lang.code)}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    activeTab === lang.code 
                      ? "bg-secondary text-primary shadow-lg" 
                      : "text-white/40 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAutoTranslate}
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-secondary/10 border border-secondary/20 text-secondary hover:bg-secondary/20 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
            >
              <Sparkles size={18} className="group-hover:animate-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">
                {loading ? "Translating all fields..." : `Translate ${LANGUAGES.find(l => l.code === activeTab)?.label} to All Languages`}
              </span>
            </button>

            {/* Translatable Fields */}
            <div className="space-y-8 p-8 bg-white/[0.02] rounded-[2rem] border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{LANGUAGES.find(l => l.code === activeTab)?.flag}</span>
                <span className="text-xs font-black uppercase tracking-widest text-secondary">
                  <span>Translating into </span>
                  <span>{LANGUAGES.find(l => l.code === activeTab)?.label}</span>
                </span>
              </div>

              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Package Name ({activeTab})</label>
                  <input 
                    value={names[activeTab]}
                    onChange={(e) => setNames({...names, [activeTab]: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-secondary transition-all"
                    placeholder={`Name in ${activeTab}...`}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Hero Description ({activeTab})</label>
                  <textarea 
                    value={descriptions[activeTab]}
                    onChange={(e) => setDescriptions({...descriptions, [activeTab]: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-secondary transition-all h-24 resize-none"
                    placeholder={`Description in ${activeTab}...`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <ListPlus size={14} className="text-emerald-400" />
                      <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Included Features ({activeTab})</label>
                    </div>
                    <textarea 
                      value={featuresStrings[activeTab]}
                      onChange={(e) => setFeaturesStrings({...featuresStrings, [activeTab]: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-emerald-400/50 transition-all h-32 resize-none text-sm"
                      placeholder="Feature 1, Feature 2..."
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <ListX size={14} className="text-red-400" />
                      <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Excluded Features ({activeTab})</label>
                    </div>
                    <textarea 
                      value={excludedStrings[activeTab]}
                      onChange={(e) => setExcludedStrings({...excludedStrings, [activeTab]: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-red-400/50 transition-all h-32 resize-none text-sm"
                      placeholder="Feature A, Feature B..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Common Fields */}
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Price ($)</label>
                <input 
                  type="number"
                  value={commonData.price}
                  onChange={(e) => setCommonData({...commonData, price: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-secondary transition-all"
                  placeholder="120"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Badge (Global - e.g. Most Popular)</label>
                <div className="relative">
                  <Star size={16} className="absolute left-6 top-5 text-amber-400" />
                  <input 
                    value={commonData.badge}
                    onChange={(e) => setCommonData({...commonData, badge: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-secondary transition-all"
                    placeholder="Most Popular"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Icon Type</label>
                <select 
                  value={commonData.icon}
                  onChange={(e) => setCommonData({...commonData, icon: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-secondary transition-all appearance-none"
                >
                  <option value="Waves">Waves</option>
                  <option value="Star">Star</option>
                  <option value="Diamond">Diamond</option>
                  <option value="Anchor">Anchor</option>
                  <option value="Shield">Shield</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Image URL</label>
                <input 
                  value={commonData.image}
                  onChange={(e) => setCommonData({...commonData, image: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-secondary transition-all"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 bg-white/5 rounded-[2rem] border border-white/10">
              <button 
                type="button"
                onClick={() => setCommonData({...commonData, isFeatured: !commonData.isFeatured})}
                className={`w-12 h-6 rounded-full transition-all relative ${commonData.isFeatured ? 'bg-secondary' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${commonData.isFeatured ? 'left-7' : 'left-1'}`} />
              </button>
              <span className="text-sm font-bold"><span>Featured Package (Blue Card & Zoom)</span></span>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-8 rounded-[2rem] bg-secondary text-primary font-black text-xl uppercase tracking-widest shadow-2xl hover:bg-white hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-4"
            >
              {loading ? (
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              ) : (
                <>
                  <Check size={28} />
                  <span>{editData ? "Update Package Everywhere" : "Publish to All Languages"}</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}
