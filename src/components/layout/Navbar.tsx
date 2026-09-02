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
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "../providers/ThemeProvider";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = session?.user?.role === "admin";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/portal/feedback", label: "Feedback", icon: ClipboardList },
    { href: "/portal/qna", label: "Live Q&A", icon: MessageSquare },
    ...(isAdmin
      ? [{ href: "/admin", label: "Admin Panel", icon: LayoutDashboard }]
      : []),
  ];

  return (
    <nav className="glass-strong sticky top-0 z-50" style={{ borderBottom: '1px solid hsla(var(--border), 0.5)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span
                className="text-xl font-bold tracking-tight leading-none"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Campus<span className="gradient-text">Pulse</span>
              </span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-wide mt-0.5">
                SMART CAMPUS HUB
              </span>
            </div>
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

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border transition-all duration-200 hover:scale-105"
              style={{
                borderColor: 'hsla(var(--border), 0.7)',
                color: 'hsl(var(--muted-foreground))',
                background: 'hsla(var(--background), 0.5)',
              }}
              aria-label="Toggle theme"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>

            {status === "loading" ? (
              <div className="w-24 h-9 rounded-lg bg-muted/40 animate-pulse" />
            ) : session ? (
              /* User Profile & Logout Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl border transition-all duration-200 hover:shadow-md"
                  style={{
                    borderColor: profileDropdownOpen ? 'hsl(var(--primary))' : 'hsla(var(--border), 0.8)',
                    background: 'hsla(var(--card), 0.8)',
                  }}
                  aria-expanded={profileDropdownOpen}
                >
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {session.user?.name ? session.user.name[0].toUpperCase() : "U"}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold leading-tight" style={{ color: 'hsl(var(--foreground))' }}>
                      {session.user?.name?.split(" ")[0]}
                    </p>
                    <span className={`inline-block text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded ${
                      isAdmin ? "bg-amber-500/15 text-amber-500" : "bg-primary/15 text-primary"
                    }`}>
                      {isAdmin ? "Admin" : "Student"}
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Floating Profile Dropdown Menu */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 rounded-2xl glass-strong border shadow-2xl p-2 z-50"
                      style={{ borderColor: 'hsla(var(--border), 0.8)' }}
                    >
                      {/* User Header */}
                      <div className="px-3 py-2.5 mb-1 rounded-xl bg-muted/40 border border-border/40">
                        <p className="text-sm font-bold text-foreground truncate">
                          {session.user?.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate mb-1.5">
                          {session.user?.email}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            isAdmin ? "bg-amber-500/20 text-amber-600 dark:text-amber-400" : "bg-primary/20 text-primary"
                          }`}>
                            {isAdmin ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
                            {isAdmin ? "University Admin" : "Verified Student"}
                          </span>
                        </div>
                      </div>

                      {/* Menu Links */}
                      <div className="space-y-1">
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-amber-500" />
                            Admin Dashboard
                          </Link>
                        )}
                        <Link
                          href="/settings"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          <Settings className="w-4 h-4 text-primary" />
                          Account Settings & Profile
                        </Link>
                      </div>

                      {/* Divider & Logout Button */}
                      <div className="my-1.5 border-t border-border/50 pt-1.5">
                        <button
                          onClick={() => signOut({ callbackUrl: "/login" })}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          id="logout-button-desktop"
                        >
                          <LogOut className="w-4 h-4" />
                          Log Out (Sign Out)
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Login & Register CTA Buttons */
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  id="navbar-login-button"
                  className="btn-secondary py-2 px-4 text-xs font-semibold flex items-center gap-1.5 rounded-xl"
                >
                  <LogIn className="w-4 h-4" />
                  Log In
                </Link>
                <Link
                  href="/register"
                  id="navbar-register-button"
                  className="btn-primary py-2 px-4 text-xs font-semibold flex items-center gap-1.5 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-xl border border-border/50"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            style={{ color: 'hsl(var(--foreground))' }}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
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
            <div className="px-4 py-4 space-y-3">
              {/* User profile section if logged in */}
              {session && (
                <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 mb-2">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white text-sm font-bold shadow-md">
                      {session.user?.name ? session.user.name[0].toUpperCase() : "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {session.user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      isAdmin ? "bg-amber-500/20 text-amber-600 dark:text-amber-400" : "bg-primary/20 text-primary"
                    }`}>
                      {isAdmin ? "Administrator" : "Student"}
                    </span>
                    <Link
                      href="/settings"
                      onClick={() => setMobileOpen(false)}
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      Settings
                    </Link>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className="space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                      style={{
                        color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
                        background: isActive ? 'hsla(var(--primary), 0.1)' : 'transparent',
                      }}
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              {/* Theme Toggle */}
              <div className="pt-2 border-t" style={{ borderColor: 'hsl(var(--border))' }}>
                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-sm font-medium border border-border/50"
                  style={{ color: 'hsl(var(--foreground))' }}
                >
                  <span className="flex items-center gap-2.5">
                    {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </span>
                  <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                    {theme}
                  </span>
                </button>
              </div>

              {/* Auth Buttons: Login / Register OR Logout */}
              <div className="pt-2 border-t border-border/50">
                {session ? (
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      signOut({ callbackUrl: "/login" });
                    }}
                    id="mobile-logout-button"
                    className="w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out from CampusPulse
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      href="/login"
                      id="mobile-login-button"
                      className="btn-secondary flex-1 justify-center py-2.5 text-xs font-semibold rounded-xl"
                      onClick={() => setMobileOpen(false)}
                    >
                      <LogIn className="w-4 h-4 mr-1.5" />
                      Log In
                    </Link>
                    <Link
                      href="/register"
                      id="mobile-register-button"
                      className="btn-primary flex-1 justify-center py-2.5 text-xs font-semibold rounded-xl shadow-md"
                      onClick={() => setMobileOpen(false)}
                    >
                      <UserPlus className="w-4 h-4 mr-1.5" />
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

