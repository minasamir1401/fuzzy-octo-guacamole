"use client";
import { API_URL } from "@/config/api";

import { useState } from "react";
import { ArrowLeft, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AddImageModal from "./AddImageModal";

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: string;
}

export default function GalleryClient({ initialImages, locale, t }: { initialImages: GalleryImage[], locale: string, t: any }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await fetch(`${API_URL}/api/gallery/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
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
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 px-8 py-4 bg-secondary text-primary font-bold rounded-2xl hover:bg-white transition-all shadow-2xl active:scale-95 group"
        >
          <Plus size={24} />
          {t.addImage}
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {initialImages.map((image) => (
          <div key={image.id} className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/5">
            <img src={image.url} alt={image.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-8 text-center">
              <p className="text-secondary font-bold text-xs uppercase tracking-widest mb-2">{image.category}</p>
              <h3 className="text-xl font-bold mb-6">{image.title}</h3>
              <button 
                onClick={() => handleDelete(image.id)}
                className="w-12 h-12 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-red-500/20 shadow-xl"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}

        {initialImages.length === 0 && (
          <div className="col-span-full py-48 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[4rem] text-white/20 bg-white/[0.01]">
            <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center mb-8">
              <ImageIcon size={48} strokeWidth={1} className="opacity-50" />
            </div>
            <p className="text-2xl font-serif mb-4">No images in gallery</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-secondary font-bold hover:underline tracking-widest uppercase text-xs"
            >
              Upload your first image
            </button>
          </div>
        )}
      </div>

      <AddImageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
