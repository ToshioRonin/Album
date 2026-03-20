"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  onPhotoUpload?: (newPhoto: any) => void;
}

export default function Header({ onPhotoUpload }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/photos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.name, 
          imageUrl: formData.url, 
        }),
      });

      if (!response.ok) {
        throw new Error("Error al subir la imagen");
      }

      const newPhoto = await response.json();

      if (onPhotoUpload) {
        onPhotoUpload(newPhoto);
      }

      setIsOpen(false);
      setFormData({ name: "", url: "" });
    } catch (error) {
      console.error("Error en la subida:", error);
      alert("No se pudo guardar la imagen. Revisa la consola.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-xl font-black tracking-tighter uppercase">
            My <span className="text-purple-500">Album</span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="px-5 py-2 rounded-full bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all duration-300 shadow-lg shadow-white/5"
          >
            Añadir Imagen +
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-zinc-950 border border-white/10 p-8 rounded-3xl shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-2 text-white">Nueva Captura</h2>
              <p className="text-zinc-500 text-sm mb-6">Completa los detalles para tu álbum.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1">Título</label>
                  <input
                    required
                    disabled={isSubmitting}
                    type="text"
                    placeholder="Ej. Interfaz de Sistema"
                    className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 mt-1 focus:outline-none focus:border-purple-500 transition-colors text-sm text-white disabled:opacity-50"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1">URL de Imagen</label>
                  <input
                    required
                    disabled={isSubmitting}
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 mt-1 focus:outline-none focus:border-purple-500 transition-colors text-sm text-white disabled:opacity-50"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-4 py-3 rounded-xl border border-white/5 text-zinc-400 font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 rounded-xl bg-purple-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-purple-500 shadow-lg shadow-purple-900/40 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Guardar"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}