export default function Features() {
  const items = [
    "Remove Duplicates",
    "Fix Missing Values",
    "CSV + Excel Support",
    "ML-Ready Export",
    "Lightning Fast",
    "Secure Processing",
  ];

  return (
    <section id="features" className="w-full max-w-6xl mx-auto px-6 py-18">
      <h2 className="text-4xl font-bold text-center text-white mb-4">
        Powerful Features
      </h2>

      <p className="text-center text-slate-400 mb-14">
        Everything you need to clean datasets faster and smarter.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:bg-white/10 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
          >
            <h3 className="text-lg font-semibold text-white mb-2">{item}</h3>
            <p className="text-sm text-slate-400">
              Save hours of manual preprocessing with one click.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}