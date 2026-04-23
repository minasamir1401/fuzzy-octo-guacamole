"use client";
import { API_URL } from "@/config/api";

import { useState, useEffect } from "react";
import { Save, Plus, Trash2, Edit2, X, Loader2 } from "lucide-react";

interface PriceItem {
  id: string;
  name: string; // Stored as JSON string
  description?: string; // Stored as JSON string
  price: string;
  category: string;
}

export default function PricingClient({ locale }: { locale: string }) {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nameEn: "",
    nameAr: "",
    nameDe: "",
    nameRu: "",
    descriptionEn: "",
    descriptionAr: "",
    descriptionDe: "",
    descriptionRu: "",
    price: "",
    category: "Courses"
  });

  const fetchPrices = async () => {
    try {
      const res = await fetch("${API_URL}/api/prices");
      if (res.ok) {
        const data = await res.json();
        setPrices(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const openModal = (item?: PriceItem) => {
    if (item) {
      let parsedName = { en: "", ar: "", de: "", ru: "" };
      let parsedDesc = { en: "", ar: "", de: "", ru: "" };
      try { parsedName = JSON.parse(item.name); } catch {}
      try { if (item.description) parsedDesc = JSON.parse(item.description); } catch {}
      setFormData({
        nameEn: parsedName.en || "",
        nameAr: parsedName.ar || "",
        nameDe: parsedName.de || "",
        nameRu: parsedName.ru || "",
        descriptionEn: parsedDesc.en || "",
        descriptionAr: parsedDesc.ar || "",
        descriptionDe: parsedDesc.de || "",
        descriptionRu: parsedDesc.ru || "",
        price: item.price,
        category: item.category
      });
      setEditingId(item.id);
    } else {
      setFormData({ 
        nameEn: "", nameAr: "", nameDe: "", nameRu: "", 
        descriptionEn: "", descriptionAr: "", descriptionDe: "", descriptionRu: "",
        price: "", category: "Courses" 
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameJson = JSON.stringify({
      en: formData.nameEn,
      ar: formData.nameAr,
      de: formData.nameDe,
      ru: formData.nameRu
    });

    const descJson = JSON.stringify({
      en: formData.descriptionEn,
      ar: formData.descriptionAr,
      de: formData.descriptionDe,
      ru: formData.descriptionRu
    });

    const payload = {
      name: nameJson,
      description: descJson,
      price: formData.price,
      category: formData.category
    };

    try {
      const url = editingId ? `${API_URL}/api/prices/${editingId}` : "${API_URL}/api/prices";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        fetchPrices();
        closeModal();
      } else {
        alert("Failed to save price item.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setPrices(prev => prev.filter(p => p.id !== id)); // Optimistic UI
      const res = await fetch(`${API_URL}/api/prices/${id}`, { method: "DELETE" });
      if (!res.ok) fetchPrices(); // Revert on failure
    } catch (err) {
      console.error(err);
      fetchPrices();
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-secondary" size={48} /></div>;
  }

  const parseName = (jsonStr: string) => {
    try {
      return JSON.parse(jsonStr)[locale] || JSON.parse(jsonStr).en || "Unnamed";
    } catch {
      return jsonStr;
    }
  };

  return (
    <div>
      <header className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-serif font-bold mb-4">Pricing Table</h1>
          <p className="text-white/40">Manage your comprehensive pricing lists for all languages.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-6 py-3 bg-secondary text-primary font-bold rounded-xl hover:bg-white transition-all shadow-xl"
        >
          <Plus size={20} />
          Add Item
        </button>
      </header>

      <div className="bg-[#12141C] rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/5">
            <tr>
              <th className="p-6 font-bold text-white/40 uppercase tracking-wider text-sm">Service Name</th>
              <th className="p-6 font-bold text-white/40 uppercase tracking-wider text-sm">Category</th>
              <th className="p-6 font-bold text-white/40 uppercase tracking-wider text-sm">Price</th>
              <th className="p-6 font-bold text-white/40 uppercase tracking-wider text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {prices.map((item) => (
              <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-6 font-bold">{parseName(item.name)}</td>
                <td className="p-6 text-white/60">
                  <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-bold uppercase tracking-wide border border-white/10">
                    {item.category}
                  </span>
                </td>
                <td className="p-6 font-bold text-secondary">{item.price}</td>
                <td className="p-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => openModal(item)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-secondary hover:text-primary transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {prices.length === 0 && (
              <tr>
                <td colSpan={4} className="p-12 text-center text-white/40 font-medium">
                  No pricing items found. Click "Add Item" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#12141C] p-8 rounded-[2rem] border border-white/10 w-full max-w-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold font-serif">{editingId ? 'Edit Item' : 'Add Item'}</h2>
              <button onClick={closeModal} className="text-white/40 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase mb-2">Name (EN)</label>
                  <input required value={formData.nameEn} onChange={e => setFormData({...formData, nameEn: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-secondary outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase mb-2">Breakdown (EN)</label>
                  <input value={formData.descriptionEn} onChange={e => setFormData({...formData, descriptionEn: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-secondary outline-none transition-all" placeholder="e.g. Food 10 + Gear 5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase mb-2">Name (AR)</label>
                  <input required value={formData.nameAr} onChange={e => setFormData({...formData, nameAr: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-secondary outline-none transition-all text-right" dir="rtl" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase mb-2">Breakdown (AR)</label>
                  <input value={formData.descriptionAr} onChange={e => setFormData({...formData, descriptionAr: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-secondary outline-none transition-all text-right" dir="rtl" placeholder="مثال: اكل 10 + معدات 5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase mb-2">Name (DE)</label>
                  <input required value={formData.nameDe} onChange={e => setFormData({...formData, nameDe: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-secondary outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase mb-2">Breakdown (DE)</label>
                  <input value={formData.descriptionDe} onChange={e => setFormData({...formData, descriptionDe: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-secondary outline-none transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase mb-2">Name (RU)</label>
                  <input required value={formData.nameRu} onChange={e => setFormData({...formData, nameRu: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-secondary outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase mb-2">Breakdown (RU)</label>
                  <input value={formData.descriptionRu} onChange={e => setFormData({...formData, descriptionRu: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-secondary outline-none transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase mb-2">Category</label>
                  <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-[#1A1D24] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-secondary outline-none transition-all">
                    <option value="Courses">Courses</option>
                    <option value="Daily Diving">Daily Diving</option>
                    <option value="Snorkeling">Snorkeling</option>
                    <option value="Equipment Rental">Equipment Rental</option>
                    <option value="Extras">Extras</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase mb-2">Price (e.g. 120$)</label>
                  <input required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-secondary outline-none transition-all" />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" className="flex items-center gap-2 px-8 py-3 liquid-gradient text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity">
                  <Save size={20} />
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
