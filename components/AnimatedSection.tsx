"use client";

import { motion } from "framer-motion";

export default function AnimatedSection({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: false, margin: "-100px" }}
    >
      {children}
    </motion.div>
  );
}