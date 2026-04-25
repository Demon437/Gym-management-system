const stats = [
  { label: "Active members", value: "2,500+" },
  { label: "Elite trainers", value: "25+" },
  { label: "Classes every week", value: "80+" },
  { label: "Transformation support", value: "100%" },
];

export default function StatsStrip() {
  return (
    <section className="border-y border-white/10 bg-[#0b1220]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 text-white sm:px-6 md:grid-cols-4 lg:px-8">
        {stats.map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 text-center">
            <p className="text-3xl font-bold text-white">{item.value}</p>
            <p className="mt-2 text-sm text-slate-400">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}