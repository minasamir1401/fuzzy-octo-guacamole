"use client";
import { API_URL } from "@/config/api";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: string;
}

export default function GalleryClient({ initialImages }: { initialImages: GalleryImage[] }) {
  const t = useTranslations("gallery");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  
  const images = initialImages.length > 0 ? initialImages : [
    {
      url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200",
      title: "Crystal Clear Depths",
      category: "Reef"
    },
    {
      url: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=1200",
      title: "Ancient Wrecks",
      category: "History"
    },
    {
      url: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=1200",
      title: "Marine Life Magic",
      category: "Wildlife"
    }
  ];

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length);
    }
  };

  const handlePrev = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-secondary font-bold tracking-[0.3em] uppercase text-xs mb-4 block"
          >
            {t("hero.badge")}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-6"
          >
            {t("hero.title1")} <span className="text-secondary italic">{t("hero.title2")}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-foreground/50 text-lg max-w-2xl mx-auto"
          >
            {t("hero.desc")}
          </motion.p>
        </header>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative aspect-[4/5] rounded-[2rem] overflow-hidden group cursor-pointer"
              onClick={() => setSelectedImage(index)}
            >
              <img 
                src={image.url} 
                alt={image.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute inset-0 flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0 transition-transform">
                <span className="text-secondary text-xs font-bold uppercase tracking-widest mb-2">
                  {image.category}
                </span>
                <h3 className="text-2xl font-bold text-white mb-4">{image.title}</h3>
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 size={20} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
          >
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors z-[110]"
            >
              <X size={40} />
            </button>

            <button 
              onClick={handlePrev}
              className="absolute left-8 text-white/40 hover:text-white transition-colors z-[110] hidden md:block"
            >
              <ChevronLeft size={60} />
            </button>

            <button 
              onClick={handleNext}
              className="absolute right-8 text-white/40 hover:text-white transition-colors z-[110] hidden md:block"
            >
              <ChevronRight size={60} />
            </button>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative max-w-5xl w-full aspect-video rounded-[2rem] overflow-hidden shadow-2xl"
            >
              <img 
                src={images[selectedImage].url} 
                alt={images[selectedImage].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black/80 to-transparent">
                <span className="text-secondary text-sm font-bold uppercase tracking-widest mb-2 block">
                  {images[selectedImage].category}
                </span>
                <h2 className="text-4xl font-serif font-bold text-white">
                  {images[selectedImage].title}
                </h2>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
