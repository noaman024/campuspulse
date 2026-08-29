"use client";

import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullPage?: boolean;
}

const sizeMap = {
  sm: { spinner: "w-6 h-6", border: "2px" },
  md: { spinner: "w-10 h-10", border: "3px" },
  lg: { spinner: "w-16 h-16", border: "4px" },
};

export default function LoadingSpinner({ size = "md", text, fullPage = false }: LoadingSpinnerProps) {
  const { spinner, border } = sizeMap[size];

  const content = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center gap-4"
    >
      <div
        className={`${spinner} rounded-full animate-spin`}
        style={{
          border: `${border} solid hsl(var(--muted))`,
          borderTopColor: "hsl(var(--primary))",
        }}
      />
      {text && (
        <p
          className="text-sm font-medium animate-pulse"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          {text}
        </p>
      )}
    </motion.div>
  );

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        {content}
      </div>
    );
  }

  return content;
}
