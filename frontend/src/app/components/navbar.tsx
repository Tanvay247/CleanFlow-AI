"use client";

import { useState } from "react";

const links = [
  { name: "Home", href: "#" },
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how" },
  { name: "Pricing", href: "#pricing" },
  { name: "API Docs", href: "#docs" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-4 md:px-6 pt-4">
      <nav className="max-w-7xl mx-auto">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl px-4 md:px-6 py-4">

          {/* Top Row */}
          <div className="flex items-center justify-between">

            {/* Brand */}
            <a href="#" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-xl bg-white text-black font-bold flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                C
              </div>

              <div>
                <h1 className="text-white font-semibold text-lg leading-none tracking-tight">
                  CleanFlow AI
                </h1>
                <p className="text-xs text-slate-400">
                  Clean Data. Faster Models.
                </p>
              </div>
            </a>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-2">
              {links.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="#login"
                className="text-sm text-slate-300 hover:text-white transition"
              >
                Login
              </a>

              <a
                href="#"
                className="rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold transition-all duration-300 hover:bg-slate-200 hover:scale-105 active:scale-95 shadow-lg"
              >
                Try Free
              </a>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden mt-4 border-t border-white/10 pt-4 space-y-2">
              {links.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/10 transition"
                >
                  {item.name}
                </a>
              ))}

              <div className="pt-2 flex flex-col gap-2">
                <a
                  href="#login"
                  className="w-full text-center rounded-xl border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/10 transition"
                >
                  Login
                </a>

                <a
                  href="#"
                  className="w-full text-center rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold hover:bg-slate-200 transition"
                >
                  Try Free
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}