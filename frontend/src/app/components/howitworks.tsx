export default function HowItWorks() {
  const steps = [
    ["1", "Upload File"],
    ["2", "We Clean It"],
    ["3", "Download Result"],
  ];

  return (
    <section id="how" className="w-full max-w-6xl mx-auto px-6">
      <h2 className="text-4xl font-bold text-center text-white mb-4">
        How It Works
      </h2>

      <p className="text-center text-slate-400 mb-14">
        Clean your dataset in 3 simple steps.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map(([num, title]) => (
          <div
            key={num}
            className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center"
          >
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-white text-black flex items-center justify-center font-bold">
              {num}
            </div>

            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}