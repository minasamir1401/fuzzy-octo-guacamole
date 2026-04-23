"use client";
import { API_URL } from "@/config/api";

import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Edit2, Trash2, Camera, UserPlus, Anchor, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AddAddonModal from "./AddAddonModal";

interface Addon {
  id: string;
  name: string;
  price: number;
  icon: string;
}

export default function AddonsClient() {
  const router = useRouter();
  const [addons, setAddons] = useState<Addon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<Addon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAddons();
  }, []);

  const fetchAddons = async () => {
    try {
      const res = await fetch(`${API_URL}/api/addons`);
      const data = await res.json();
      setAddons(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/addons/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setAddons(prev => prev.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Camera": return <Camera size={24} />;
      case "UserPlus": return <UserPlus size={24} />;
      case "Anchor": return <Anchor size={24} />;
      default: return <MoreHorizontal size={24} />;
    }
  };

  const parseSafe = (str: string) => {
    try {
      const parsed = JSON.parse(str);
      return parsed.en || str;
    } catch {
      return str;
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <header className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-6 mb-4">
            <Link href="/admin" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/5">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-4xl font-serif font-bold">Booking Add-ons</h1>
          </div>
          <p className="text-white/40 text-lg">Manage extra services available during booking.</p>
        </div>
        <button 
          onClick={() => {
            setEditingAddon(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-3 px-8 py-4 bg-secondary text-primary font-bold rounded-2xl hover:bg-white transition-all shadow-2xl active:scale-95 group"
        >
          <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          Add New Add-on
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {addons.map((addon) => (
          <div key={addon.id} className="bg-[#12141C] p-8 rounded-[2.5rem] border border-white/5 hover:border-secondary/30 transition-all group relative">
            <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => {
                  setEditingAddon(addon);
                  setIsModalOpen(true);
                }}
                className="p-2 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10"
              >
                <Edit2 size={18} />
              </button>
              <button 
                onClick={() => handleDelete(addon.id)}
                className="p-2 rounded-xl bg-red-500/10 text-red-500/60 hover:text-white hover:bg-red-500"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20 mb-8">
              {getIcon(addon.icon)}
            </div>

            <h3 className="text-2xl font-bold mb-2">{parseSafe(addon.name)}</h3>
            <p className="text-3xl font-black text-secondary">${addon.price}</p>
          </div>
        ))}

        {addons.length === 0 && !loading && (
          <div className="col-span-full py-32 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] text-white/20">
            <Plus size={48} className="mb-4 opacity-20" />
            <p className="text-xl font-serif">No add-ons found</p>
          </div>
        )}
      </div>

      <AddAddonModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAddon(null);
        }}
        editData={editingAddon}
        onSuccess={() => fetchAddons()}
      />
    </div>
  );
}
