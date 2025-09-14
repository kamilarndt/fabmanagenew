import { motion } from "framer-motion";
import React from "react";

interface FadeInProps {
  children: React.ReactNode;
  durationMs?: number;
  delayMs?: number;
}

export function FadeIn({
  children,
  durationMs = 200,
  delayMs = 0,
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: durationMs / 1000, delay: delayMs / 1000 }}
    >
      {children}
    </motion.div>
  );
}
