import { ArrowRight, PlayCircle, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#08101c] pt-28 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(239,68,68,0.18),_transparent_28%),radial-gradient(circle_at_left,_rgba(59,130,246,0.12),_transparent_24%)]" />
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
            <Sparkles size={16} className="text-red-400" /> Premium fitness, real results
          </div>
          <h1 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
            Build a stronger body in a smarter, premium gym environment.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            FitCore combines elite trainers, curated classes, performance tracking, and a modern training atmosphere for real transformation.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/plans"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/30 transition hover:-translate-y-0.5"
            >
              View Memberships <ArrowRight size={16} />
            </Link>
            <Link
              to="/classes"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white"
            >
              <PlayCircle size={16} /> Explore Classes
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-slate-300">
            <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-emerald-400" /> Professional trainers</div>
            <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-emerald-400" /> High-end equipment</div>
            <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-emerald-400" /> Group classes & coaching</div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-8 top-10 h-28 w-28 rounded-full bg-red-500/20 blur-3xl" />
          <div className="absolute -right-4 bottom-8 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-3 shadow-2xl shadow-black/30">
            <img
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80"
              alt="Premium gym interior"
              className="h-[560px] w-full rounded-[1.5rem] object-cover"
            />
            <div className="absolute bottom-8 left-8 right-8 rounded-3xl border border-white/10 bg-[#08101c]/80 p-5 backdrop-blur-xl">
              <div className="grid grid-cols-3 gap-4 text-center text-white">
                <div>
                  <p className="text-3xl font-bold">10k+</p>
                  <p className="text-xs text-slate-300">Workout Sessions</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">25+</p>
                  <p className="text-xs text-slate-300">Expert Trainers</p>
                </div>
                <div>                   
                    <p className="text-3xl font-bold">4.9</p>
                    <p className="text-xs text-slate-300">Member Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}