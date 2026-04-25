export default function ClassCard({ item }) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-7 text-white transition hover:-translate-y-1 hover:border-red-500/30">
      <h3 className="text-2xl font-semibold">{item.className}</h3>
      <div className="mt-5 space-y-3 text-sm text-slate-300">
        <p>Time: {item.time}</p>
        <p>Capacity: {item.capacity}</p>
        <p>Enrolled: {item.enrolled}</p>
        <p>Trainer: {item.trainer?.fullName || "Not assigned"}</p>
      </div>
    </div>
  );
}