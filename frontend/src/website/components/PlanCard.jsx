export default function PlanCard({ plan }) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-7 text-white transition hover:-translate-y-1 hover:border-red-500/30">
      <p className="text-sm uppercase tracking-[0.3em] text-red-400">{plan.duration}</p>
      <h3 className="mt-4 text-2xl font-semibold">{plan.name}</h3>
      <div className="mt-6 flex items-end gap-2">
        <span className="text-5xl font-bold">₹{plan.price}</span>
      </div>
      <ul className="mt-6 space-y-3 text-sm text-slate-300">
        {(plan.features || []).map((feature, index) => (
          <li key={index}>• {feature}</li>
        ))}
      </ul>
      <button className="mt-8 w-full rounded-full bg-gradient-to-r from-red-500 to-rose-600 px-5 py-3 text-sm font-semibold text-white">
        Choose Plan
      </button>
    </div>
  );
}