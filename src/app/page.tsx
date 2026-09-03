"use client";

import Link from "next/link";
import { Calendar, LogIn, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main
      className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center"
    >
      {/* Headline */}
      <h1
        className="font-extrabold tracking-tight text-foreground mb-4"
        style={{ fontSize: "clamp(2rem, 6vw, 3.75rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
      >
        All Campus Events,{" "}
        <span className="gradient-text">One Place.</span>
      </h1>

      <p className="text-sm sm:text-base mb-10 max-w-md" style={{ color: "hsl(var(--fg-muted))" }}>
        Discover university events, register, and get your instant digital QR pass.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/events"
          className="btn-primary py-3 px-8 text-sm rounded-xl"
        >
          <Calendar className="w-4 h-4" />
          Browse Events
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/login"
          className="btn-secondary py-3 px-8 text-sm rounded-xl"
        >
          <LogIn className="w-4 h-4" />
          Sign In
        </Link>
      </div>
    </main>
  );
}
