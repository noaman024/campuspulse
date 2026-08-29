"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Users,
  PieChart,
} from "lucide-react";
import {
  getDashboardStats,
  getCategoryDistribution,
  getMonthlyEventData,
} from "@/actions/analytics";
import StatsCard from "@/components/ui/StatsCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const categoryColors: Record<string, string> = {
  Technical: "252 85% 63%",
  Cultural: "330 85% 60%",
  Sports: "152 69% 45%",
  Workshop: "38 92% 50%",
};

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [categories, setCategories] = useState<{ category: string; count: number }[]>([]);
  const [monthly, setMonthly] = useState<{ month: string; events: number; registrations: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [s, c, m] = await Promise.all([
          getDashboardStats(),
          getCategoryDistribution(),
          getMonthlyEventData(),
        ]);
        setStats(s);
        setCategories(c);
        setMonthly(m);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner size="lg" text="Loading analytics..." fullPage />;

  const maxReg = Math.max(...monthly.map((m) => m.registrations), 1);

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "hsl(var(--foreground))" }}>
          Analytics
        </h1>
        <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
          Insights and trends from your campus events
        </p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Events" value={stats?.totalEvents as number || 0} icon={Calendar} color="252 85% 63%" index={0} />
        <StatsCard title="Total Registrations" value={stats?.totalRegistrations as number || 0} icon={Users} color="173 80% 40%" index={1} />
        <StatsCard title="Attendance Rate" value={`${stats?.attendanceRate || 0}%`} icon={TrendingUp} color="152 69% 45%" index={2} />
        <StatsCard title="Feedback Received" value={stats?.totalFeedbackSubmissions as number || 0} icon={BarChart3} color="38 92% 50%" index={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="glass-card p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: "hsl(var(--foreground))" }}>
            <TrendingUp className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />
            Monthly Trend
          </h2>
          {monthly.length === 0 ? (
            <p className="text-sm text-center py-12" style={{ color: "hsl(var(--muted-foreground))" }}>No data for the last 6 months</p>
          ) : (
            <div className="space-y-4">
              {monthly.map((m, i) => (
                <motion.div
                  key={m.month}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>{m.month}</span>
                    <div className="flex items-center gap-4 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                      <span><Calendar className="w-3 h-3 inline mr-1" />{m.events} events</span>
                      <span><Users className="w-3 h-3 inline mr-1" />{m.registrations} regs</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "hsl(var(--primary))" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(m.registrations / maxReg) * 100}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Category Distribution */}
        <div className="glass-card p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: "hsl(var(--foreground))" }}>
            <PieChart className="w-5 h-5" style={{ color: "hsl(var(--accent))" }} />
            Event Categories
          </h2>
          {categories.length === 0 ? (
            <p className="text-sm text-center py-12" style={{ color: "hsl(var(--muted-foreground))" }}>No events yet</p>
          ) : (
            <div className="space-y-6">
              {/* Visual donut-like display */}
              <div className="flex items-center justify-center gap-8 py-4">
                <div className="relative w-32 h-32">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    {(() => {
                      const total = categories.reduce((s, c) => s + c.count, 0);
                      let offset = 0;
                      return categories.map((cat) => {
                        const pct = (cat.count / total) * 100;
                        const circumference = 2 * Math.PI * 35;
                        const dashLength = (pct / 100) * circumference;
                        const el = (
                          <circle
                            key={cat.category}
                            cx="50"
                            cy="50"
                            r="35"
                            fill="none"
                            strokeWidth="12"
                            stroke={`hsl(${categoryColors[cat.category] || "252 85% 63%"})`}
                            strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                            strokeDashoffset={`${-offset * circumference / 100}`}
                            strokeLinecap="round"
                          />
                        );
                        offset += pct;
                        return el;
                      });
                    })()}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-xl font-bold" style={{ color: "hsl(var(--foreground))" }}>
                        {categories.reduce((s, c) => s + c.count, 0)}
                      </p>
                      <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Total</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-3">
                {categories.map((cat) => {
                  const total = categories.reduce((s, c) => s + c.count, 0);
                  const pct = Math.round((cat.count / total) * 100);
                  const color = categoryColors[cat.category] || "252 85% 63%";
                  return (
                    <div key={cat.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: `hsl(${color})` }} />
                        <span className="text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>{cat.category}</span>
                      </div>
                      <span className="text-sm font-bold" style={{ color: `hsl(${color})` }}>{cat.count} ({pct}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
