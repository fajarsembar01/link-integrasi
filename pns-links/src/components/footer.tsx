"use client";

import { Heart } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-12 border-t border-border/60 bg-gradient-to-b from-background to-background/60"
      aria-label="Footer"
    >
      <div className="mx-auto max-w-6xl px-4 py-6">
        <p className="text-center text-sm text-muted-foreground">
          © {year} • Create by{" "}
          <span className="font-medium text-foreground">
            Latsar Angkatan 167 Kelompok 4B
          </span>{" "}

        </p>
      </div>
    </footer>
  );
}
