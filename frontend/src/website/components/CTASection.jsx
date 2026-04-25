import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section className="bg-[#08101c] py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-r from-red-600/20 via-white/[0.04] to-blue-500/10 p-8 text-center shadow-2xl shadow-black/20 sm:p-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to transform with FitCore?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Join a premium fitness experience with expert coaching, powerful routines, and consistent progress support.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/contact" className="rounded-full bg-gradient-to-r from-red-500 to-rose-600 px-6 py-3 font-semibold text-white">
              Book a Visit
            </Link>
            <Link to="/plans" className="rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white">
              View Plans
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}