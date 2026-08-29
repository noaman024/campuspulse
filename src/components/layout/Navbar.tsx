"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Calendar,
  LogIn,
  LogOut,
  UserPlus,
  LayoutDashboard,
  Moon,
  Sun,
  Menu,
  X,
  MessageSquare,
  ClipboardList,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "../providers/ThemeProvider";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = session?.user?.role === "admin";

  const navLinks = [
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/portal/feedback", label: "Feedback", icon: ClipboardList },
    { href: "/portal/qna", label: "Live Q&A", icon: MessageSquare },
    ...(isAdmin
      ? [{ href: "/admin", label: "Admin", icon: LayoutDashboard }]
      : []),
  ];

  return (
    <nav className="glass-strong sticky top-0 z-50" style={{ borderBottom: '1px solid hsla(var(--border), 0.5)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span
              className="text-xl font-bold tracking-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Campus<span className="gradient-text">Pulse</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                  style={{
                    color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                    background: isActive ? 'hsla(var(--primary), 0.08)' : 'transparent',
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                      style={{ background: 'hsl(var(--primary))' }}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'hsl(var(--muted-foreground))' }}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {session ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                    {session.user?.name}
                  </p>
                  <p className="text-xs capitalize" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    {session.user?.role}
                  </p>
                </div>
                <div
                  className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold"
                >
                  {session.user?.name?.[0]?.toUpperCase()}
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="btn-secondary py-2 px-3 text-sm"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="btn-secondary py-2 px-4 text-sm">
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link href="/register" className="btn-primary py-2 px-4 text-sm">
                  <UserPlus className="w-4 h-4" />
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            style={{ color: 'hsl(var(--foreground))' }}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t"
            style={{ borderColor: 'hsla(var(--border), 0.5)' }}
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
                      background: isActive ? 'hsla(var(--primary), 0.08)' : 'transparent',
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-2 border-t" style={{ borderColor: 'hsl(var(--border))' }}>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium"
                  style={{ color: 'hsl(var(--foreground))' }}
                >
                  {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </button>
              </div>
              {!session && (
                <div className="flex gap-2 pt-2">
                  <Link href="/login" className="btn-secondary flex-1 justify-center py-2.5 text-sm" onClick={() => setMobileOpen(false)}>
                    Login
                  </Link>
                  <Link href="/register" className="btn-primary flex-1 justify-center py-2.5 text-sm" onClick={() => setMobileOpen(false)}>
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
