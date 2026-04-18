import Link from "next/link";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-white/10 mt-12 py-10 text-center text-slate-400 text-sm"
    >
      <div className="flex flex-wrap justify-center gap-6 mb-4">
        <Link href="/privacy" className="hover:text-white transition">
          Privacy
        </Link>
        <Link href="/contact" className="hover:text-white transition">
          Contact
        </Link>
        <Link href="/about" className="hover:text-white transition">
          About
        </Link>
      </div>
      <p>© 2026 CleanFlow AI. Built for smarter machine learning workflows.</p>
    </footer>
  );
}