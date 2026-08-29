"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: string;
  trend?: { value: number; isPositive: boolean };
  index?: number;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "252 85% 63%",
  trend,
  index = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="glass-card p-6 relative overflow-hidden group"
    >
      {/* Background glow */}
      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle, hsl(${color}), transparent)` }}
      />

      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p
            className="text-sm font-medium"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <motion.p
              className="text-3xl font-bold"
              style={{ color: "hsl(var(--foreground))" }}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: index * 0.1 + 0.2 }}
            >
              {value}
            </motion.p>
            {trend && (
              <span
                className="text-xs font-semibold"
                style={{
                  color: trend.isPositive
                    ? "hsl(var(--success))"
                    : "hsl(var(--destructive))",
                }}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {subtitle && (
            <p
              className="text-xs"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              {subtitle}
            </p>
          )}
        </div>

        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `hsl(${color} / 0.12)` }}
        >
          <Icon className="w-6 h-6" style={{ color: `hsl(${color})` }} />
        </div>
      </div>
    </motion.div>
  );
}
