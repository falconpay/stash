"use client";

import { motion } from "framer-motion";

export function PageTransition({
  children,
  direction = "forward",
}: {
  children: React.ReactNode;
  direction?: "forward" | "up";
}) {
  const variants =
    direction === "up"
      ? { initial: { y: "100%" }, animate: { y: 0 } }
      : { initial: { x: 24, opacity: 0 }, animate: { x: 0, opacity: 1 } };

  return (
    <motion.div
      initial={variants.initial}
      animate={variants.animate}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      className="min-h-full"
    >
      {children}
    </motion.div>
  );
}
