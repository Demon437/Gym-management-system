export default function TrainerCard({ trainer }) {
  return (
    <div className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-1 hover:border-red-500/30">
      <img
        src="https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=900&q=80"
        alt={trainer.fullName}
        className="h-80 w-full rounded-[1.35rem] object-cover"
      />
      <div className="pt-5">
        <h3 className="text-xl font-semibold text-white">{trainer.fullName}</h3>
        <p className="mt-2 text-sm text-red-400">{trainer.specialization}</p>
        <p className="mt-3 text-sm text-slate-400">Experience: {trainer.experience || 0} years</p>
      </div>
    </div>
  );
}