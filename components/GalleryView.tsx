"use client";

import Image from "next/image";
import { useState } from "react";
import { BsGrid, BsGrid3X3Gap, BsList, BsPencil, BsTrash, BsCheckCircleFill, BsX } from "react-icons/bs";
import ImageCard from "./ImageCard";
import { motion } from "framer-motion";

type ImageType = {
  id: number;
  src: string;
  name: string;
  description?: string;
};

interface GalleryViewProps {
  images: ImageType[];
  onItemClick: (index: number) => void;
  onDeleteMultiple?: (ids: number[]) => void;
}

export default function GalleryView({ images, onItemClick, onDeleteMultiple }: GalleryViewProps) {
  const [view, setView] = useState<"grid" | "large" | "list">("grid");
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSelect = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAction = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`¿Eliminar ${selectedIds.length} imágenes permanentemente?`)) {
      onDeleteMultiple?.(selectedIds);
      setSelectedIds([]);
      setIsEditMode(false);
    }
  };

  return (
    <div>
      {/* --- BARRA DE HERRAMIENTAS --- */}
      <div className="flex justify-between items-center mb-10 bg-zinc-900/40 p-3 rounded-2xl border border-white/5 backdrop-blur-md">
        
        {/* IZQUIERDA: Selectores de Vista */}
        <div className="flex gap-1.5 bg-black/20 p-1 rounded-xl">
          <button 
            onClick={() => setView("grid")} 
            className={`p-2.5 rounded-lg transition-all ${view === "grid" ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            <BsGrid size={18} />
          </button>
          <button 
            onClick={() => setView("large")} 
            className={`p-2.5 rounded-lg transition-all ${view === "large" ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            <BsGrid3X3Gap size={18} />
          </button>
          <button 
            onClick={() => setView("list")} 
            className={`p-2.5 rounded-lg transition-all ${view === "list" ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            <BsList size={20} />
          </button>
        </div>

        {/* DERECHA: Edición y Selección */}
        <div className="flex gap-3 items-center">
          {isEditMode && selectedIds.length > 0 && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleAction}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest"
            >
              <BsTrash size={14} />
              Borrar {selectedIds.length}
            </motion.button>
          )}

          <button
            onClick={() => {
              setIsEditMode(!isEditMode);
              setSelectedIds([]);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-bold text-xs uppercase tracking-widest border ${
              isEditMode 
                ? "bg-white text-black border-white" 
                : "bg-zinc-800/50 text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-white"
            }`}
          >
            {isEditMode ? <BsX size={18} /> : <BsPencil size={14} />}
            {isEditMode ? "Cancelar" : "Editar"}
          </button>
        </div>
      </div>

      {/* --- GRID DE IMÁGENES --- */}
      <div className={`
        ${view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" : ""}
        ${view === "large" ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4" : ""}
        ${view === "list" ? "flex flex-col gap-3" : ""}
      `}>
        {images.map((img, i) => {
          const isSelected = selectedIds.includes(img.id);
          
          return (
            <div
              key={img.id}
              onClick={(e) => isEditMode ? toggleSelect(img.id, e) : onItemClick(i)}
              className={`group relative cursor-pointer transition-all duration-500 ${
                isEditMode && isSelected ? "scale-[0.97]" : ""
              } ${view === "list" ? "flex items-center gap-5 bg-zinc-900/40 p-3 rounded-2xl border border-white/5 hover:bg-zinc-800/60" : ""}`}
            >
              {isEditMode && (
                <div className="absolute top-4 left-4 z-30 shadow-2xl transition-transform duration-300 scale-110">
                  {isSelected ? (
                    <BsCheckCircleFill className="text-purple-500 bg-white rounded-full border-2 border-white" size={26} />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-white/30 bg-black/40 backdrop-blur-md hover:border-white/60" />
                  )}
                </div>
              )}

              {isEditMode && view !== "list" && (
                <div className={`absolute inset-0 z-20 transition-colors duration-300 rounded-[2rem] ${
                  isSelected ? "bg-purple-500/20 border-2 border-purple-500" : "bg-black/10 group-hover:bg-black/0"
                }`} />
              )}

              {view === "list" ? (
                <>
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                    <Image src={img.src} alt={img.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <p className={`text-sm font-medium tracking-tight ${isSelected ? "text-purple-400" : "text-zinc-200"}`}>
                      {img.name}
                    </p>
                    <span className="text-[10px] text-zinc-600 uppercase tracking-tighter">ID: {img.id}</span>
                  </div>
                </>
              ) : (
                <div className="relative overflow-hidden">
                   <ImageCard image={img} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}