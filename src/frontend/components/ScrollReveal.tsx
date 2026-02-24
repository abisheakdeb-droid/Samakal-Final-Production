"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
  viewport?: { once: boolean; margin: string };
}

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ScrollReveal({ 
  children, 
  delay = 0, 
  direction = "up",
  className = "",
  viewport = { once: true, margin: "-50px" } 
}: ScrollRevealProps) {
  
  const getVariants = () => {
      switch(direction) {
          case "up": return { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
          case "down": return { hidden: { opacity: 0, y: -30 }, visible: { opacity: 1, y: 0 } };
          case "left": return { hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0 } };
          case "right": return { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } };
          default: return variants;
      }
  };

  return (
    <motion.div
      variants={getVariants()}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      transition={{ duration: 0.6, delay: delay * 0.1, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
