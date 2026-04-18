export const metadata = {
  title: "Contact – CleanFlow AI",
  description: "Get in touch with the CleanFlow AI team for support or feedback.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-32 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="max-w-3xl mx-auto px-6 py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-slate-300 mb-10">
          Have questions, feedback, or feature requests? We'd love to hear from you.
        </p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-wide text-slate-400 mb-1">
                Email
              </p>
              <a
                href="mailto:your-email@example.com"
                className="text-xl text-green-400 hover:underline"
              >
                your-email@example.com
              </a>
            </div>

            <div>
              <p className="text-sm uppercase tracking-wide text-slate-400 mb-1">
                Twitter / X
              </p>
              <a
                href="https://x.com/yourhandle"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl text-green-400 hover:underline"
              >
                @yourhandle
              </a>
            </div>

            <div>
              <p className="text-sm uppercase tracking-wide text-slate-400 mb-1">
                GitHub
              </p>
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl text-green-400 hover:underline"
              >
                /yourusername
              </a>
            </div>
          </div>

          <p className="mt-8 text-sm text-slate-400">
            We typically respond within 24–48 hours.
          </p>
        </div>
      </div>
    </main>
  );
}