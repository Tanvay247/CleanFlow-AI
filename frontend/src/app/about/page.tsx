export const metadata = {
  title: "About – CleanFlow AI",
  description: "Learn about CleanFlow AI – the mission, the tool, and the team.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-32 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-6">About CleanFlow AI</h1>

        <div className="space-y-6 text-slate-300 text-lg leading-relaxed">
          <p>
            <span className="text-white font-semibold">CleanFlow AI</span> was 
            built with one mission: to eliminate the friction between messy 
            datasets and machine learning readiness.
          </p>

          <p>
            As data scientists and ML engineers ourselves, we know that 80% of 
            the work happens before a model ever sees the data. CleanFlow AI 
            automates that grunt work—outlier removal, missing value imputation, 
            type optimization—so you can focus on what matters: building models.
          </p>

          <p>
            Whether you're a researcher, student, or industry professional, 
            CleanFlow AI is your first stop for clean, analysis‑ready data.
          </p>

          <div className="mt-10 p-6 bg-green-500/10 border border-green-400/20 rounded-2xl">
            <p className="text-white font-medium">
              🚀 CleanFlow AI is free and open to all. No signup required.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}