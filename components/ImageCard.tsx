"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type ImageType = {
  src: string;
  name: string;
  description?: string;
};

export default function ImageCard({ image }: { image: ImageType }) {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative w-full aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer bg-zinc-900 border border-white/5 shadow-2xl"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src={image.src}
          alt={image.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-80 group-hover:opacity-100"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

      <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 transition-colors duration-500 rounded-3xl z-10" />

      <div className="absolute bottom-4 left-4 right-4 z-20">
        <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[0.22, 1, 0.36, 1]">
          
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400 mb-2 block">
            Captura
          </span>

          <h3 className="text-white font-bold text-xl tracking-tight leading-none mb-2">
            {image.name}
          </h3>

          {image.description && (
            <p className="text-xs text-zinc-400 font-light leading-relaxed line-clamp-2">
              {image.description}
            </p>
          )}

          <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
            <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Detalles</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M5 12h14m-7-7 7 7-7 7"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-1000 bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),_rgba(255,255,255,0.1)_0%,_transparent_80%)]" />
    </motion.div>
  );
}