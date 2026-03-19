"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";

type ImageType = {
  src: string;
  name: string;
  description?: string;
};

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: ImageType[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

export default function ImageModal({
  isOpen,
  onClose,
  images,
  currentIndex,
  setCurrentIndex,
}: ImageModalProps) {
  
  const next = () => setCurrentIndex((currentIndex + 1) % images.length);
  const prev = () => setCurrentIndex((currentIndex - 1 + images.length) % images.length);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-[110] text-white/50 hover:text-white transition-colors"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <button 
          onClick={prev}
          className="absolute left-4 md:left-10 z-[110] p-4 text-white/30 hover:text-white hover:bg-white/10 rounded-full transition-all"
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-5xl h-[70vh] md:h-[80vh] px-4 select-none"
        >
          <Image
            src={images[currentIndex].src}
            alt={images[currentIndex].name}
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-2">{images[currentIndex].name}</h3>
            {images[currentIndex].description && (
              <p className="text-zinc-400 font-light">{images[currentIndex].description}</p>
            )}
            <div className="mt-4 text-[10px] text-zinc-600 tracking-[0.3em] uppercase">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>

        <button 
          onClick={next}
          className="absolute right-4 md:right-10 z-[110] p-4 text-white/30 hover:text-white hover:bg-white/10 rounded-full transition-all"
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="absolute inset-0 z-0" onClick={onClose} />
      </div>
    </AnimatePresence>
  );
}