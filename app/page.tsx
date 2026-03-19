"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Carousel from "@/components/Carousel";
import GalleryView from "@/components/GalleryView";
import AnimatedSection from "@/components/AnimatedSection";
import ImageModal from "@/components/ImageModal";

export default function Home() {
  const galleryRef = useRef<HTMLDivElement | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const images = [
    { src: "/images/manzana.png", name: "Captura de Sistema 1", description: "Interfaz principal del módulo administrativo desarrollado en Next.js." },
    { src: "/images/manzana.png", name: "Captura de Sistema 2", description: "Visualización de analíticas en tiempo real con gráficos dinámicos." },
    { src: "/images/manzana.png", name: "Captura de Sistema 3", description: "Arquitectura de contenedores Docker para el despliegue de microservicios." },
    { src: "/images/manzana.png", name: "Captura de Sistema 4", description: "Esquema de base de datos relacional optimizado para alta concurrencia." },
    { src: "/images/manzana.png", name: "Captura de Sistema 5", description: "Implementación de sistema de votación con estados automatizados." },
  ];

  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleOpenModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-black text-white selection:bg-purple-500/30 overflow-x-hidden w-full antialiased">
      <Header />

      <ImageModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        images={images}
        currentIndex={selectedImageIndex}
        setCurrentIndex={setSelectedImageIndex}
      />

      {/* --- HERO --- */}
      <section className="relative h-[100dvh] w-full flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black to-black z-0 pointer-events-none" />
        <div className="absolute w-[600px] h-[600px] bg-purple-600/10 blur-[140px] rounded-full top-[-10%] left-1/2 -translate-x-1/2 pointer-events-none z-0" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10"
        >
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent leading-[0.9]">
            My <br className="md:hidden" /> Album
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 mb-12 font-light tracking-wide leading-relaxed">
            Gestión visual de activos y recuerdos con <span className="text-white font-medium">arquitectura moderna</span>.
          </p>

          <div className="flex flex-col items-center gap-6">
            <button
              onClick={scrollToGallery}
              className="group relative px-10 py-4 rounded-full bg-white text-black font-bold text-sm uppercase tracking-[0.2em] hover:bg-purple-600 hover:text-white transition-all duration-500 transform hover:scale-105 active:scale-95 shadow-2xl shadow-white/10"
            >
              Explorar Galería
            </button>
          </div>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 13L12 18L17 13M7 6L12 11L17 6" />
          </svg>
        </div>
      </section>

      <main className="relative w-full z-10">
        
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

        {/* --- CARRUSEL --- */}
        <section ref={galleryRef} className="relative py-32 md:py-48 overflow-hidden bg-black">
            <div className="absolute top-24 left-1/2 -translate-x-1/2 text-[15vw] font-black text-white/[0.02] select-none pointer-events-none uppercase tracking-tighter">
                Spotlight
            </div>

            <AnimatedSection>
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 relative z-10">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white italic">Row One</h2>
                            <p className="text-zinc-500 mt-2 font-mono text-sm uppercase tracking-[0.3em]">Destacadas del Sistema</p>
                        </div>
                        <div className="h-[1px] flex-grow mx-10 bg-zinc-900 hidden md:block mb-4 opacity-50" />
                    </div>
                    
                    <div className="relative z-10">
                        <Carousel images={images} />
                    </div>
                </div>
            </AnimatedSection>
        </section>

        {/* --- GALERIA --- */}
        <section className="bg-[#050505] py-32 md:py-48 border-t border-zinc-900">
            <AnimatedSection>
                <div className="container mx-auto px-6">
                    <header className="max-w-3xl mb-24">
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">Galería</h2>
                        <div className="w-20 h-1 bg-purple-600 mb-8" />
                        <p className="text-zinc-500 text-lg md:text-xl leading-relaxed font-light">
                            Compilación completa de capturas. Haz clic en cualquier tarjeta para expandir la vista.
                        </p>
                    </header>
                    
                    <GalleryView images={images} onItemClick={handleOpenModal} />
                </div>
            </AnimatedSection>
        </section>

        <footer className="py-24 border-t border-zinc-900/50 text-center bg-black">
            <p className="text-zinc-700 text-[10px] tracking-[0.6em] uppercase font-black">
                ENCODED BY ROW ONE • {new Date().getFullYear()}
            </p>
        </footer>
        
      </main>
    </div>
  );
}