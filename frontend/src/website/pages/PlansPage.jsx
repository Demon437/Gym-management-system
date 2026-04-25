import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getPlans } from "../../api/planApi";

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const data = await getPlans();
        setPlans(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Plans fetch error:", error);
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f6fb] text-slate-900">
      <section className="px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
            {/* LEFT PANEL */}
            <aside className="lg:sticky lg:top-24 lg:h-fit">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
                <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-red-500">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  Memberships
                </div>

                <h1 className="mt-5 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
                  Pick a plan
                  <span className="block text-red-500">that fits your</span>
                  routine.
                </h1>

                <p className="mt-5 text-sm leading-8 text-slate-600">
                  Explore membership plans tailored to different fitness goals,
                  schedules, and training preferences.
                </p>

                <div className="mt-6 space-y-3">
                  {[
                    "Simple membership choices",
                    "Live plans from admin panel",
                    "Flexible options for every member",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-red-500" />
                      <span className="text-sm text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <a
                    href="/contact"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-red-600"
                  >
                    Join Now
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </aside>

            {/* RIGHT CONTENT */}
            <div>
              {loading ? (
                <div className="rounded-[2rem] border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
                  Loading plans...
                </div>
              ) : plans.length === 0 ? (
                <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500 shadow-sm">
                  No plans available right now.
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {plans.map((plan) => {
                    const features = Array.isArray(plan?.features)
                      ? plan.features.filter(Boolean)
                      : [];

                    const included = Array.isArray(plan?.included)
                      ? plan.included.filter(Boolean)
                      : [];

                    const highlights = Array.isArray(plan?.highlights)
                      ? plan.highlights.filter(Boolean)
                      : [];

                    const accentColor = plan?.color || "#ef4444";

                    return (
                      <div
                        key={plan._id}
                        className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                      >
                        <div
                          className="absolute inset-x-0 top-0 h-1.5"
                          style={{ backgroundColor: accentColor }}
                        />

                        <div className="flex h-full flex-col">
                          <div className="mb-5">
                            <h2 className="text-2xl font-bold text-slate-900">
                              {plan.name || "Membership Plan"}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                              {plan.duration || "1 Month"}
                            </p>
                          </div>

                          <div className="mb-5 flex items-end gap-2">
                            <span className="text-4xl font-black tracking-tight text-slate-900">
                              ₹{Number(plan.price || 0).toFixed(0)}
                            </span>
                            <span className="pb-1 text-sm text-slate-500">
                              / {plan.duration || "month"}
                            </span>
                          </div>

                          {plan.description && (
                            <p className="mb-5 text-sm leading-7 text-slate-600">
                              {plan.description}
                            </p>
                          )}

                          {highlights.length > 0 && (
                            <div className="mb-5 flex flex-wrap gap-2">
                              {highlights.map((tag, index) => (
                                <span
                                  key={index}
                                  className="rounded-full border border-red-100 bg-red-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-red-500"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {included.length > 0 && (
                            <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                                Included
                              </p>
                              <ul className="space-y-2">
                                {included.map((item, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-2 text-sm text-slate-700"
                                  >
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {features.length > 0 && (
                            <div className="mb-6">
                              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                                Features
                              </p>
                              <ul className="space-y-2">
                                {features.map((feature, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-2 text-sm text-slate-700"
                                  >
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <a
                            href="/contact"
                            className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:opacity-90"
                            style={{ backgroundColor: accentColor }}
                          >
                            {plan.buttonText || "Choose Plan"}
                            <ArrowRight className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}