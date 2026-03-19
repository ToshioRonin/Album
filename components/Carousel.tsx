"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ImageType = {
  src: string;
  name: string;
};

export default function Carousel({ images }: { images: ImageType[] }) {
  const [current, setCurrent] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);

const prev = () => setCurrent((p) => (p === 0 ? images.length - 1 : p - 1));
const next = () => setCurrent((p) => (p === images.length - 1 ? 0 : p + 1));

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    let isThrottled = false;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isThrottled) return;
      if (Math.abs(e.deltaY) > 10) {
        e.deltaY > 0 ? next() : prev();
        isThrottled = true;
        setTimeout(() => (isThrottled = false), 600);
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [images.length]);

  return (
    <div ref={carouselRef} className="relative w-full h-[500px] flex items-center justify-center perspective-1000 overflow-hidden">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(147,51,234,0.1)_0%,_transparent_50%)] pointer-events-none" />

      <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          {images.map((img, index) => {
            const isCenter = index === current;
            const isLeft = index === (current === 0 ? images.length - 1 : current - 1);
            const isRight = index === (current === images.length - 1 ? 0 : current + 1);

            if (!isCenter && !isLeft && !isRight) return null;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: isCenter ? 1 : 0.4,
                  scale: isCenter ? 1 : 0.75,
                  x: isLeft ? "-60%" : isRight ? "60%" : "0%",
                  rotateY: isLeft ? 35 : isRight ? -35 : 0,
                  z: isCenter ? 0 : -200,
                  filter: isCenter ? "blur(0px)" : "blur(4px)",
                }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`absolute w-[300px] md:w-[500px] aspect-[16/10] rounded-3xl z-${isCenter ? '20' : '10'}`}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="relative group w-full h-full">
                  <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <Image
                      src={img.src}
                      alt={img.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
                  </div>

                  <div className="absolute -bottom-[65%] left-0 right-0 h-full w-full pointer-events-none select-none opacity-30">
                    <div className="relative w-full h-full scale-y-[-1] mask-gradient">
                       <Image
                        src={img.src}
                        alt="reflection"
                        fill
                        className="object-cover rounded-3xl blur-sm"
                      />
                    </div>
                  </div>
                  
                  {isCenter && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap"
                    >
                      <h3 className="text-white font-bold text-xl tracking-[0.2em] uppercase">{img.name}</h3>
                      <div className="h-1 w-full bg-purple-600 mt-2 scale-x-50 group-hover:scale-x-100 transition-transform duration-500" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <button onClick={prev} className="absolute left-8 z-30 p-4 text-white/20 hover:text-purple-500 transition-colors uppercase text-xs tracking-widest font-bold hidden md:block">
        Prev
      </button>
      <button onClick={next} className="absolute right-8 z-30 p-4 text-white/20 hover:text-purple-500 transition-colors uppercase text-xs tracking-widest font-bold hidden md:block">
        Next
      </button>

      <div className="absolute bottom-4 flex gap-2">
        {images.map((_, i) => (
          <div 
            key={i} 
            className={`h-1 transition-all duration-500 ${i === current ? 'w-8 bg-purple-500' : 'w-2 bg-zinc-800'}`} 
          />
        ))}
      </div>
    </div>
  );
}