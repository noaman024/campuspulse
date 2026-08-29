"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Mail, Lock, User, Building, Hash, UserPlus, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    rollNumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      router.push("/login?registered=true");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "name", label: "Full Name", type: "text", icon: User, placeholder: "John Doe", required: true },
    { key: "email", label: "Email", type: "email", icon: Mail, placeholder: "you@university.edu", required: true },
    { key: "department", label: "Department", type: "text", icon: Building, placeholder: "Computer Science", required: true },
    { key: "rollNumber", label: "Roll Number", type: "text", icon: Hash, placeholder: "CS2024001", required: false },
  ];

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 gradient-mesh">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 rounded-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Campus<span className="gradient-text">Pulse</span>
              </span>
            </Link>
            <h1 className="text-2xl font-bold mb-2" style={{ color: "hsl(var(--foreground))" }}>
              Create Account
            </h1>
            <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
              Join the campus community today
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex items-center gap-2 p-3 rounded-lg mb-6 text-sm"
              style={{ background: "hsl(var(--destructive) / 0.1)", color: "hsl(var(--destructive))" }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.key}>
                  <label className="text-sm font-medium mb-1.5 block" style={{ color: "hsl(var(--foreground))" }}>
                    {field.label}
                    {!field.required && (
                      <span className="text-xs ml-1" style={{ color: "hsl(var(--muted-foreground))" }}>(optional)</span>
                    )}
                  </label>
                  <div className="relative">
                    <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "hsl(var(--muted-foreground))" }} />
                    <input
                      type={field.type}
                      value={form[field.key as keyof typeof form]}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="input-field input-with-icon-left"
                      required={field.required}
                    />
                  </div>
                </div>
              );
            })}

            {/* Password */}
            <div>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: "hsl(var(--foreground))" }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "hsl(var(--muted-foreground))" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  placeholder="Min 6 characters"
                  className="input-field input-with-icon-left input-with-icon-right"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 hover:text-foreground"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password.length > 0 && (
                <div className="flex items-center gap-1.5 mt-2">
                  <CheckCircle
                    className="w-3.5 h-3.5"
                    style={{ color: form.password.length >= 6 ? "hsl(var(--success))" : "hsl(var(--muted-foreground))" }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: form.password.length >= 6 ? "hsl(var(--success))" : "hsl(var(--muted-foreground))" }}
                  >
                    At least 6 characters
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 rounded-xl text-base disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                <span className="flex items-center gap-2 justify-center">
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </span>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center mt-6 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold transition-colors" style={{ color: "hsl(var(--primary))" }}>
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
