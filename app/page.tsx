"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Carousel from "@/components/Carousel";
import GalleryView from "@/components/GalleryView";
import ImageModal from "@/components/ImageModal";

export default function Home() {
  const galleryRef = useRef<HTMLDivElement | null>(null);

  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const fetchPhotos = async () => {
    try {
      const response = await fetch("/api/photos");
      
      if (!response.ok) {
        setImages([]);
        return;
      }

      const text = await response.text();
      if (!text) {
        setImages([]);
        return;
      }

      const data = JSON.parse(text);
      
      if (Array.isArray(data)) {

        const formatted = data.map((img: any) => ({
          ...img,
          src: img.imageUrl,
          name: img.title
        }));
        setImages(formatted);
      }
    } catch (error) {
      console.error("Error al cargar fotos:", error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleNewPhoto = (newPhoto: any) => {
    const formatted = { 
      ...newPhoto, 
      src: newPhoto.imageUrl, 
      name: newPhoto.title 
    };
    setImages((prev) => [formatted, ...prev]);
  };

  const handleDeletePhoto = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta imagen?")) return;

    try {
      const response = await fetch(`/api/photos/${id}`, { method: "DELETE" });
      if (response.ok) {
        setImages((prev) => prev.filter((img) => img.id !== id));
        setIsModalOpen(false);
      } else {
        alert("No se pudo eliminar la imagen.");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const handleDeleteMultiple = async (ids: number[]) => {
    try {
      const deletePromises = ids.map(id => 
        fetch(`/api/photos/${id}`, { method: "DELETE" })
      );

      const results = await Promise.all(deletePromises);
      const allOk = results.every(res => res.ok);

      if (allOk) {
        setImages((prev) => prev.filter((img) => !ids.includes(img.id)));
        alert(`¡${ids.length} imágenes eliminadas correctamente!`);
      } else {
        alert("Hubo un error al intentar eliminar algunas imágenes.");
        // Refrescamos de la BD por si acaso
        fetchPhotos();
      }
    } catch (error) {
      console.error("Error en borrado masivo:", error);
    }
  };

  const handleUpdatePhoto = async (id: number, newTitle: string, newUrl: string) => {
    try {
      const response = await fetch(`/api/photos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, imageUrl: newUrl }),
      });

      if (response.ok) {
        const updated = await response.json();
        setImages((prev) =>
          prev.map((img) =>
            img.id === id 
              ? { ...img, name: updated.title, src: updated.imageUrl, title: updated.title, imageUrl: updated.imageUrl } 
              : img
          )
        );
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleOpenModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  if (loading) return (
    <div className="bg-black h-screen flex items-center justify-center">
      <div className="text-white font-mono animate-pulse uppercase text-xs tracking-[0.5em]">
        Cargando Álbum...
      </div>
    </div>
  );

  return (
    <div className="bg-black text-white selection:bg-purple-500/30 overflow-x-hidden w-full antialiased">
      
      <Header onPhotoUpload={handleNewPhoto} />

      <ImageModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        images={images}
        currentIndex={selectedImageIndex}
        setCurrentIndex={setSelectedImageIndex}
        onDelete={handleDeletePhoto}
        onUpdate={handleUpdatePhoto}
      />

      {/* Hero Section */}
<section className="relative h-[100dvh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-black z-0" />
  
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
    className="relative z-10 flex flex-col items-center"
  >
    <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-4 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
      My Album
    </h1>

    {/* --- TEXTO DE DESCRIPCIÓN --- */}
    <p className="max-w-md text-zinc-400 text-lg md:text-xl font-light leading-relaxed mb-10 balance">
      Una colección visual curada donde cada imagen cuenta una historia única a través de la lente.
    </p>

    <button
      onClick={scrollToGallery}
      className="px-10 py-4 rounded-full bg-white text-black font-bold text-sm uppercase tracking-[0.2em] hover:bg-purple-600 hover:text-white transition-all transform hover:scale-105 shadow-2xl shadow-white/10"
    >
      Explorar Galería
    </button>
  </motion.div>
</section>

      <main className="relative z-10">
        
        {/* Carrusel de Favoritos (Últimas 5) */}
        {images.length > 0 && (
          <section ref={galleryRef} className="py-32 bg-black overflow-hidden">
            <div className="container mx-auto px-6">
               <h2 className="text-4xl font-bold italic mb-16 text-center opacity-50 uppercase tracking-[0.3em]">Recientes</h2>
               <Carousel images={images.slice(0, 5)} />
            </div>
          </section>
        )}

        {/* Galería Principal */}
        <section className="bg-[#050505] py-32 border-t border-zinc-900">
            <div className="container mx-auto px-6">
                <header className="max-w-3xl mb-24">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 uppercase">Galería</h2>
                    <div className="w-20 h-1 bg-purple-600" />
                </header>
                
                {images.length > 0 ? (
                  <GalleryView 
                    images={images} 
                    onItemClick={handleOpenModal} 
                    onDeleteMultiple={handleDeleteMultiple}
                  />
                ) : (
                  <div className="py-20 text-center border border-dashed border-zinc-800 rounded-[3rem]">
                    <p className="text-zinc-600 uppercase text-xs tracking-widest font-mono">
                      No se encontraron capturas en la base de datos
                    </p>
                  </div>
                )}
            </div>
        </section>

        <footer className="py-24 text-center bg-black border-t border-zinc-900/50">
            <p className="text-zinc-700 text-[10px] tracking-[0.6em] uppercase font-black">
                ENCODED BY ROW ONE • {new Date().getFullYear()}
            </p>
        </footer>
      </main>
    </div>
  );
}