"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // ✅ Add this

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how" },
  { name: "Privacy", href: "/privacy" },
  { name: "Contact", href: "/contact" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname(); // ✅ Get current path

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      setMenuOpen(false);
    }
  };

  // ✅ Custom handler for Home link
  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-4 md:px-6 pt-4">
      <nav className="max-w-7xl mx-auto">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl px-4 md:px-6 py-4">
          {/* Top Row */}
          <div className="flex items-center justify-between">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-xl bg-white text-black font-bold flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                C
              </div>
              <div>
                <h1 className="text-white font-semibold text-lg leading-none tracking-tight">
                  CleanFlow AI
                </h1>
                <p className="text-xs text-slate-400">Clean Data. Faster Models.</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-2">
              {navLinks.map((item) => {
                // ✅ Special handling for Home
                if (item.name === "Home") {
                  return (
                    <Link
                      key={item.name}
                      href="/"
                      onClick={handleHomeClick}
                      className="px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                    >
                      {item.name}
                    </Link>
                  );
                }
                // Other internal pages (non-hash)
                if (item.href.startsWith("/") && !item.href.startsWith("/#")) {
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  );
                }
                // Hash links (smooth scroll)
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleSmoothScroll(e, item.href)}
                    className="px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    {item.name}
                  </a>
                );
              })}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/contact"
                className="text-sm text-slate-300 hover:text-white transition"
              >
                Support
              </Link>
              <Link
                href="/"
                className="rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold transition-all duration-300 hover:bg-slate-200 hover:scale-105 active:scale-95 shadow-lg"
              >
                Try Free
              </Link>
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
              {navLinks.map((item) => {
                // ✅ Special handling for Home in mobile
                if (item.name === "Home") {
                  return (
                    <Link
                      key={item.name}
                      href="/"
                      onClick={handleHomeClick}
                      className="block px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/10 transition"
                    >
                      {item.name}
                    </Link>
                  );
                }
                if (item.href.startsWith("/") && !item.href.startsWith("/#")) {
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/10 transition"
                    >
                      {item.name}
                    </Link>
                  );
                }
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleSmoothScroll(e, item.href)}
                    className="block px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/10 transition"
                  >
                    {item.name}
                  </a>
                );
              })}
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/contact"
                  className="w-full text-center rounded-xl border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/10 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Support
                </Link>
                <Link
                  href="/"
                  className="w-full text-center rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold hover:bg-slate-200 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Try Free
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}