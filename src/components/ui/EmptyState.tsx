"use client";

import { motion } from "framer-motion";
import { LucideIcon, Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: "hsl(var(--muted))" }}
      >
        <Icon className="w-10 h-10" style={{ color: "hsl(var(--muted-foreground))" }} />
      </div>
      <h3
        className="text-lg font-semibold mb-2"
        style={{ color: "hsl(var(--foreground))" }}
      >
        {title}
      </h3>
      {description && (
        <p
          className="text-sm max-w-md leading-relaxed mb-6"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          {description}
        </p>
      )}
      {action && (
        <button onClick={action.onClick} className="btn-primary">
          {action.label}
        </button>
      )}
    </motion.div>
  );
}
