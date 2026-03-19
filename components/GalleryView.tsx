"use client";

import Image from "next/image";
import { useState } from "react";
import { BsGrid, BsGrid3X3Gap, BsList } from "react-icons/bs";
import ImageCard from "./ImageCard";

// 1. Definimos exactamente qué campos tiene una imagen
type ImageType = {
  src: string;
  name: string;
  description?: string; // El '?' es vital si algunas no tienen descripción
};

// 2. Declaramos que este componente RECIBE imágenes y la función de click
interface GalleryViewProps {
  images: ImageType[];
  onItemClick: (index: number) => void;
}

export default function GalleryView({ images, onItemClick }: GalleryViewProps) {
  const [view, setView] = useState<"grid" | "large" | "list">("grid");

  return (
    <div>
      <div className="flex justify-end gap-3 mb-8">
        <button onClick={() => setView("grid")} className={`p-2 rounded-lg transition ${view === "grid" ? "bg-purple-700" : "bg-zinc-800"}`}><BsGrid size={18} /></button>
        <button onClick={() => setView("large")} className={`p-2 rounded-lg transition ${view === "large" ? "bg-purple-700" : "bg-zinc-800"}`}><BsGrid3X3Gap size={18} /></button>
        <button onClick={() => setView("list")} className={`p-2 rounded-lg transition ${view === "list" ? "bg-purple-700" : "bg-zinc-800"}`}><BsList size={20} /></button>
      </div>

      {view === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img, i) => (
            <div key={i} onClick={() => onItemClick(i)} className="cursor-pointer">
              <ImageCard image={img} />
            </div>
          ))}
        </div>
      )}

      {view === "large" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {images.map((img, i) => (
            <div key={i} onClick={() => onItemClick(i)} className="cursor-pointer">
              <ImageCard image={img} />
            </div>
          ))}
        </div>
      )}

      {view === "list" && (
        <div className="flex flex-col gap-4">
          {images.map((img, i) => (
            <div
              key={i}
              onClick={() => onItemClick(i)}
              className="flex items-center gap-4 bg-zinc-900 p-3 rounded-xl hover:bg-zinc-800 transition cursor-pointer border border-white/5"
            >
              <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={img.src} alt={img.name} fill className="object-cover" />
              </div>
              <p className="text-zinc-300">{img.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}