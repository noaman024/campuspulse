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
  User,
  Settings,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "../providers/ThemeProvider";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = session?.user?.role === "admin";
  const isLoading = status === "loading";

  // Track scroll to enhance glass effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/portal/feedback", label: "Feedback", icon: ClipboardList },
    { href: "/portal/qna", label: "Live Q&A", icon: MessageSquare },
    ...(isAdmin ? [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }] : []),
  ];

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <>
      <nav
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? "var(--glass-bg)"
            : "transparent",
          backdropFilter: scrolled ? `blur(${scrolled ? "20px" : "0"})` : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? "1px solid var(--glass-border)"
            : "1px solid transparent",
          boxShadow: scrolled ? "0 1px 20px rgba(15,23,42,0.06)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ─── Logo ─── */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
                  boxShadow: "0 2px 10px hsl(var(--primary) / 0.35)",
                }}
              >
                <Zap className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <span className="text-[17px] font-800 tracking-tight text-foreground leading-none">
                  Campus<span className="gradient-text font-extrabold">Pulse</span>
                </span>
                <p className="text-[9px] text-muted-foreground font-semibold tracking-widest mt-0.5 uppercase">
                  University Portal
                </p>
              </div>
            </Link>

            {/* ─── Desktop Nav Links ─── */}
            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative flex items-center gap-1.5 px-3.5 py-2 text-[13.5px] font-medium rounded-lg transition-all duration-150"
                    style={{
                      color: isActive ? "hsl(var(--primary))" : "hsl(var(--fg-muted))",
                      background: isActive ? "hsl(var(--primary) / 0.08)" : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.color = "hsl(var(--fg))";
                      if (!isActive) (e.currentTarget as HTMLElement).style.background = "hsl(var(--border) / 0.5)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.color = "hsl(var(--fg-muted))";
                      if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent";
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-lg"
                        style={{ background: "hsl(var(--primary) / 0.08)", zIndex: -1 }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* ─── Right Actions ─── */}
            <div className="hidden md:flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="btn-ghost p-2 rounded-xl"
                aria-label="Toggle theme"
              >
                {theme === "dark"
                  ? <Sun className="w-4 h-4" />
                  : <Moon className="w-4 h-4" />}
              </button>

              {isLoading ? (
                <div className="w-8 h-8 rounded-full bg-border animate-pulse" />
              ) : session?.user ? (
                /* ── Authenticated: Profile Dropdown ── */
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileOpen((p) => !p)}
                    className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-2xl border transition-all duration-150 hover:border-primary/40 hover:bg-primary/5"
                    style={{
                      borderColor: "hsl(var(--border))",
                      background: "hsl(var(--surface-raised))",
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{
                        background: isAdmin
                          ? "linear-gradient(135deg, hsl(35 92% 48%), hsl(25 90% 45%))"
                          : "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
                      }}
                    >
                      {userInitials}
                    </div>
                    <div className="text-left hidden sm:block">
                      <p className="text-xs font-semibold text-foreground leading-none">
                        {session.user.name?.split(" ")[0] ?? "User"}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {isAdmin ? "Admin" : "Student"}
                      </p>
                    </div>
                    <ChevronDown
                      className="w-3.5 h-3.5 text-muted-foreground transition-transform duration-200"
                      style={{ transform: profileOpen ? "rotate(180deg)" : "rotate(0)" }}
                    />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-0 top-full mt-2 w-56 rounded-2xl border overflow-hidden"
                        style={{
                          background: "var(--glass-bg)",
                          backdropFilter: "blur(20px)",
                          WebkitBackdropFilter: "blur(20px)",
                          borderColor: "var(--glass-border)",
                          boxShadow: "var(--shadow-lg)",
                        }}
                      >
                        {/* User Info */}
                        <div
                          className="px-4 py-3 border-b"
                          style={{ borderColor: "var(--glass-border)" }}
                        >
                          <p className="text-xs font-bold text-foreground truncate">{session.user.name}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{session.user.email}</p>
                          <span
                            className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{
                              background: isAdmin ? "hsl(35 92% 48% / 0.15)" : "hsl(var(--primary) / 0.12)",
                              color: isAdmin ? "hsl(35 92% 42%)" : "hsl(var(--primary))",
                            }}
                          >
                            {isAdmin ? <ShieldCheck className="w-2.5 h-2.5" /> : <User className="w-2.5 h-2.5" />}
                            {isAdmin ? "University Admin" : "Verified Student"}
                          </span>
                        </div>

                        {/* Menu Items */}
                        <div className="p-1.5 space-y-0.5">
                          {isAdmin && (
                            <Link
                              href="/admin"
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl transition-colors"
                              style={{ color: "hsl(var(--fg))" }}
                              onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "hsl(var(--border) / 0.5)"}
                              onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "transparent"}
                            >
                              <LayoutDashboard className="w-3.5 h-3.5 text-muted-foreground" />
                              Admin Dashboard
                            </Link>
                          )}
                          <Link
                            href="/settings"
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl transition-colors"
                            style={{ color: "hsl(var(--fg))" }}
                            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "hsl(var(--border) / 0.5)"}
                            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "transparent"}
                          >
                            <Settings className="w-3.5 h-3.5 text-muted-foreground" />
                            Account Settings
                          </Link>
                        </div>

                        <div
                          className="p-1.5 border-t"
                          style={{ borderColor: "var(--glass-border)" }}
                        >
                          <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors text-left"
                            style={{ color: "hsl(var(--danger))" }}
                            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "hsl(var(--danger) / 0.08)"}
                            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "transparent"}
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* ── Not Authenticated ── */
                <>
                  <Link href="/login" className="btn-ghost text-sm py-2 px-3.5">
                    <LogIn className="w-3.5 h-3.5" />
                    Sign In
                  </Link>
                  <Link href="/register" className="btn-primary text-sm py-2 px-4">
                    <UserPlus className="w-3.5 h-3.5" />
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* ─── Mobile Hamburger ─── */}
            <div className="md:hidden flex items-center gap-2">
              <button onClick={toggleTheme} className="btn-ghost p-2 rounded-xl" aria-label="Toggle theme">
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setMobileOpen((o) => !o)}
                className="btn-ghost p-2 rounded-xl"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* ─── Mobile Drawer ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: "rgba(0,0,0,0.25)", backdropFilter: "blur(4px)" }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-72 z-50 md:hidden flex flex-col"
              style={{
                background: "var(--glass-bg)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                borderLeft: "1px solid var(--glass-border)",
                boxShadow: "-4px 0 40px rgba(0,0,0,0.15)",
              }}
            >
              {/* Drawer Header */}
              <div
                className="flex items-center justify-between px-5 h-16 border-b flex-shrink-0"
                style={{ borderColor: "var(--glass-border)" }}
              >
                <span className="text-sm font-bold text-foreground">Navigation</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="btn-ghost p-1.5 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {navLinks.map((link, i) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all"
                        style={{
                          color: isActive ? "hsl(var(--primary))" : "hsl(var(--fg))",
                          background: isActive ? "hsl(var(--primary) / 0.10)" : "transparent",
                        }}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Drawer Footer */}
              <div
                className="px-3 py-4 border-t space-y-2 flex-shrink-0"
                style={{ borderColor: "var(--glass-border)" }}
              >
                {session?.user ? (
                  <>
                    <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-border/30">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{
                          background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
                        }}
                      >
                        {userInitials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{session.user.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{session.user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                      style={{ color: "hsl(var(--danger))", background: "hsl(var(--danger) / 0.06)" }}
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Link href="/login" className="btn-secondary w-full justify-center py-2.5 text-sm">
                      <LogIn className="w-4 h-4" /> Sign In
                    </Link>
                    <Link href="/register" className="btn-primary w-full justify-center py-2.5 text-sm">
                      <UserPlus className="w-4 h-4" /> Create Account
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
