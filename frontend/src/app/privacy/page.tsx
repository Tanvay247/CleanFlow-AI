export const metadata = {
  title: "Privacy Policy – CleanFlow AI",
  description: "How CleanFlow AI handles your data and protects your privacy.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-32 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-slate-300">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">1. Data We Collect</h2>
            <p>
              CleanFlow AI processes files temporarily for cleaning purposes only. 
              Uploaded datasets are automatically deleted from our servers within 1 hour.
              We do not store, share, or sell your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">2. How We Use Your Data</h2>
            <p>
              Your uploaded CSV/Excel files are used solely to perform the cleaning 
              operations you request. No data is retained after processing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">3. Cookies & Analytics</h2>
            <p>
              We may use basic analytics to understand site usage. No personal 
              information is collected through cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">4. Contact</h2>
            <p>
              Questions? Reach out via our{" "}
              <a href="/contact" className="text-green-400 hover:underline">
                Contact page
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}