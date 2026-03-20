"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BsTrash, BsPencil, BsCheck, BsX } from "react-icons/bs";

type ImageType = {
  id: number;
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
  onDelete: (id: number) => void;
  onUpdate: (id: number, title: string, url: string) => void;
}

export default function ImageModal({
  isOpen,
  onClose,
  images,
  currentIndex,
  setCurrentIndex,
  onDelete,
  onUpdate,
}: ImageModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");

  const currentImage = images[currentIndex];

  useEffect(() => {
    if (currentImage) {
      setEditTitle(currentImage.name);
      setEditUrl(currentImage.src);
    }
  }, [currentIndex, currentImage, isEditing]);

  const next = () => setCurrentIndex((currentIndex + 1) % images.length);
  const prev = () => setCurrentIndex((currentIndex - 1 + images.length) % images.length);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate(currentImage.id, editTitle, editUrl);
    setIsEditing(false);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        isEditing ? setIsEditing(false) : onClose();
      }
      if (!isEditing) {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, isEditing]);

  if (!isOpen || !currentImage) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl">
        
        <div className="absolute top-6 right-6 z-[130] flex gap-4 items-center">
          {!isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-purple-400 transition-all border border-white/5"
              >
                <BsPencil size={20} />
              </button>
              <button 
                onClick={() => onDelete(currentImage.id)}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-red-500 transition-all border border-white/5"
              >
                <BsTrash size={20} />
              </button>
            </>
          ) : (
            <div className="flex gap-2">
               <button onClick={handleSave} className="p-3 bg-green-500 rounded-full text-white hover:bg-green-600 transition-all shadow-lg shadow-green-500/20">
                 <BsCheck size={24} />
               </button>
               <button onClick={() => setIsEditing(false)} className="p-3 bg-zinc-800 rounded-full text-white hover:bg-zinc-700 transition-all">
                 <BsX size={24} />
               </button>
            </div>
          )}
          <div className="w-px h-6 bg-white/10 mx-2" />
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!isEditing && (
          <>
            <button onClick={prev} className="absolute left-4 md:left-10 z-[110] p-4 text-white/30 hover:text-white hover:bg-white/10 rounded-full transition-all">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button onClick={next} className="absolute right-4 md:right-10 z-[110] p-4 text-white/30 hover:text-white hover:bg-white/10 rounded-full transition-all">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-5xl h-[60vh] md:h-[75vh] px-4 select-none z-[110]"
        >
          <Image
            src={currentImage.src}
            alt={currentImage.name}
            fill
            className={`object-contain transition-all duration-500 ${isEditing ? 'opacity-30 blur-md scale-95' : 'opacity-100'}`}
            priority
          />
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/90 to-transparent z-[140]">
          <div className="max-w-5xl mx-auto">
            {isEditing ? (
              <motion.div 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                onClick={(e) => e.stopPropagation()} // CRÍTICO: Evita que el clic cierre el modal
                className="relative space-y-4 bg-zinc-900/90 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-2xl shadow-2xl"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] text-purple-400 uppercase tracking-[0.2em] font-bold block mb-3">Título</label>
                    <input 
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      autoFocus
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-purple-400 uppercase tracking-[0.2em] font-bold block mb-3">URL de Imagen</label>
                    <input 
                      type="text"
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="relative z-[110]">
                <h3 className="text-3xl font-black text-white mb-2 tracking-tight uppercase italic">{currentImage.name}</h3>
                {currentImage.description && (
                  <p className="text-zinc-400 font-light max-w-2xl">{currentImage.description}</p>
                )}
                <div className="mt-6 text-[10px] text-zinc-600 tracking-[0.4em] uppercase flex items-center gap-6">
                  <span className="bg-white/5 px-3 py-1 rounded-full text-zinc-400">{currentIndex + 1} / {images.length}</span>
                  <span className="opacity-40 font-mono">UUID: {currentImage.id}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div 
          className="absolute inset-0 z-[105]" 
          onClick={() => !isEditing && onClose()} 
        />
      </div>
    </AnimatePresence>
  );
}