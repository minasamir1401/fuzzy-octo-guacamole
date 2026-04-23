"use client";
import { API_URL } from "@/config/api";

import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Edit2, Trash2, Package as PackageIcon, Check } from "lucide-react";
import Link from "next/link";
import AddPackageModal from "./AddPackageModal";
import { useRouter } from "next/navigation";

import { Package } from "@/types";

export default function PackagesClient({ initialPackages, locale, t }: { initialPackages: Package[], locale: string, t: any }) {
  const router = useRouter();
  const [packages, setPackages] = useState(initialPackages);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);

  useEffect(() => {
    setPackages(initialPackages);
  }, [initialPackages]);

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    // Removing confirm dialog in case browser is blocking popups
    // if (!confirm("Are you sure you want to delete this package?")) return;

    try {
      const res = await fetch(`${API_URL}/api/packages/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPackages(prev => prev.filter(p => p.id !== id));
        router.refresh();
      } else {
        const errorData = await res.json();
        alert(`Failed to delete: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
      alert("Network error: Could not reach the server.");
    }
  };

  const handleToggleFeatured = async (pkg: Package) => {
    try {
      const res = await fetch(`${API_URL}/api/packages/${pkg.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !pkg.isFeatured }),
      });

      if (res.ok) {
        setPackages(prev => prev.map(p => p.id === pkg.id ? { ...p, isFeatured: !p.isFeatured } : p));
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <header className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-6 mb-4">
            <Link href={`/${locale}/admin`} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/5">
              <ArrowLeft size={24} className="rtl:rotate-180" />
            </Link>
            <h1 className="text-4xl font-serif font-bold">{t.title}</h1>
          </div>
          <p className="text-white/40 text-lg">{t.subtitle}</p>
        </div>
        <button 
          onClick={() => {
            setEditingPackage(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-3 px-8 py-4 bg-secondary text-primary font-bold rounded-2xl hover:bg-white transition-all shadow-2xl active:scale-95 group"
        >
          <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          Add New Package
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        {packages.map((pkg) => {
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
              if (Array.isArray(parsed)) return parsed; // Old format
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

          const name = parseSafe(pkg.name, locale);
          const description = parseSafe(pkg.description, locale);
          const features = parseArraySafe(pkg.features, locale);
          const excluded = parseArraySafe(pkg.excludedFeatures, locale);
          const featuresCount = features.length;
          const excludedCount = excluded.length;

          return (
            <div key={pkg.id} className="bg-[#12141C] rounded-[3rem] border border-white/5 overflow-hidden group hover:border-secondary/30 transition-all flex h-96 shadow-2xl relative">
              {/* Action Buttons (Top Right) */}
              <div className="absolute top-6 right-6 z-20 flex gap-2">
                <button 
                  onClick={() => handleEdit(pkg)}
                  className="p-3 rounded-2xl bg-black/40 backdrop-blur-md text-white/60 hover:text-white hover:bg-secondary hover:text-primary transition-all border border-white/10"
                  title="Edit Package"
                >
                  <Edit2 size={20} />
                </button>
                <button 
                  onClick={() => handleDelete(pkg.id)}
                  className="p-3 rounded-2xl bg-red-500/10 backdrop-blur-md text-red-500/60 hover:text-white hover:bg-red-500 transition-all border border-red-500/20"
                  title="Delete Package"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="w-2/5 relative overflow-hidden bg-white/5 flex items-center justify-center">
                {pkg.image ? (
                  <>
                    <img src={pkg.image} alt={name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#12141C]" />
                  </>
                ) : (
                  <PackageIcon size={48} className="text-white/10" />
                )}
                {pkg.badge && (
                  <div className="absolute top-6 left-6 bg-secondary text-primary px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl">
                    {pkg.badge}
                  </div>
                )}
              </div>

              <div className="flex-1 p-10 flex flex-col justify-between relative">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                      <PackageIcon size={24} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                        {pkg.level} • {pkg.type}
                      </span>
                      <h3 className="text-2xl font-bold group-hover:text-secondary transition-colors line-clamp-1">{name}</h3>
                    </div>
                  </div>
                  
                  <p className="text-sm text-white/40 line-clamp-3 leading-relaxed font-medium mb-6">{description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-3">
                      {features.slice(0, 4).map((f: string) => (
                        <div key={f} className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                          <Check size={14} className="text-emerald-400" />
                          <span className="text-xs font-bold text-emerald-400">{f}</span>
                        </div>
                      ))}
                      {featuresCount > 4 && <span className="text-xs font-bold text-white/20">+{featuresCount - 4} more</span>}
                    </div>
                    {excludedCount > 0 && (
                      <div className="flex flex-wrap gap-3">
                        {excluded.slice(0, 2).map((e: string) => (
                          <div key={e} className="flex items-center gap-2 bg-red-500/10 px-3 py-1.5 rounded-xl border border-red-500/20">
                            <Trash2 size={14} className="text-red-400" />
                            <span className="text-xs font-bold text-red-400">{e}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              <div className="flex justify-between items-center pt-8 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-white tracking-tighter">${pkg.price}</span>
                  <span className="text-xs text-white/20">|</span>
                  <span className="text-sm text-white/40 font-medium tracking-wide">{pkg.duration}</span>
                </div>
                <button 
                  onClick={() => handleToggleFeatured(pkg)}
                  className={`flex items-center gap-2 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest border transition-all ${
                    pkg.isFeatured 
                      ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' 
                      : 'text-white/20 bg-white/5 border-white/10 hover:text-white/40 hover:bg-white/10'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${pkg.isFeatured ? 'bg-emerald-400 animate-pulse' : 'bg-white/20'}`} />
                  {pkg.isFeatured ? 'Featured' : 'Regular'}
                </button>
              </div>
            </div>
          </div>
        );
      })}
        
        {packages.length === 0 && (
          <div className="col-span-full py-48 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[4rem] text-white/20 bg-white/[0.01]">
            <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center mb-8">
              <PackageIcon size={48} strokeWidth={1} className="opacity-50" />
            </div>
            <p className="text-2xl font-serif mb-4">No packages found</p>
            <button 
              onClick={() => {
                setEditingPackage(null);
                setIsModalOpen(true);
              }}
              className="text-secondary font-bold hover:underline tracking-widest uppercase text-xs"
            >
              Create your first package
            </button>
          </div>
        )}
      </div>

      <AddPackageModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingPackage(null);
        }} 
        editData={editingPackage}
        onSuccess={(pkg) => {
          if (editingPackage) {
            setPackages(prev => prev.map(p => p.id === pkg.id ? pkg : p));
          } else {
            setPackages(prev => [pkg, ...prev]);
          }
        }}
      />
    </>
  );
}
