"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    url: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subiendo imagen:", formData);
    // Aquí conectarías con tu lógica de Prisma o API
    setIsOpen(false);
    setFormData({ name: "", description: "", url: "" });
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo / Nombre */}
          <div className="text-xl font-black tracking-tighter uppercase">
            My <span className="text-purple-500">Album</span>
          </div>

          {/* Botón de Acción */}
          <button
            onClick={() => setIsOpen(true)}
            className="px-5 py-2 rounded-full bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all duration-300 shadow-lg shadow-white/5"
          >
            Añadir Imagen +
          </button>
        </div>
      </header>

      {/* MODAL DE SUBIDA */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Card del Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-zinc-950 border border-white/10 p-8 rounded-3xl shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-2">Nueva Captura</h2>
              <p className="text-zinc-500 text-sm mb-6">Completa los detalles para tu álbum.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1">Nombre</label>
                  <input
                    required
                    type="text"
                    placeholder="Ej. Paisaje de Colima"
                    className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 mt-1 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1">Descripción</label>
                  <textarea
                    placeholder="Cuéntanos la historia..."
                    className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 mt-1 focus:outline-none focus:border-purple-500 transition-colors text-sm min-h-[100px] resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1">URL de Imagen</label>
                  <input
                    required
                    type="url"
                    placeholder="https://ejemplo.com/foto.jpg"
                    className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 mt-1 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-4 py-3 rounded-xl border border-white/5 text-zinc-400 font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-xl bg-purple-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-purple-500 shadow-lg shadow-purple-900/40 transition-all active:scale-95"
                  >
                    Guardar
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