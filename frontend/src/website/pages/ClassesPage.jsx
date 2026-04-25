import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Users,
  CalendarDays,
} from "lucide-react";
import { getAllClasses } from "../../api/classApi";

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const data = await getAllClasses();
        console.log("Website classes data:", data);
        setClasses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Classes page fetch error:", error);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const featuredClass = classes[0];
  const otherClasses = classes.slice(1);

  return (
    <div className="min-h-screen bg-[#f4f6fb] text-slate-900">
      <section className="px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-red-500">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Classes
            </div>

            <h1 className="mt-5 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Workout sessions
              <span className="block text-red-500">built for strength,</span>
              <span className="block text-slate-600">energy, and routine.</span>
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
              Explore dynamic classes designed to improve consistency, stamina,
              and member engagement. Every class added from the admin dashboard
              appears here automatically.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="lg:sticky lg:top-24 lg:h-fit">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-500">
                  Class Benefits
                </p>

                <div className="mt-8 space-y-8">
                  {[
                    {
                      title: "More engaging",
                      text: "Structured sessions help members stay regular and motivated.",
                    },
                    {
                      title: "Better guidance",
                      text: "Sessions feel easier to follow for beginners and active members.",
                    },
                    {
                      title: "Higher energy",
                      text: "Group training creates better momentum and consistency.",
                    },
                  ].map((item) => (
                    <div key={item.title}>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-8 text-slate-600">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-3xl font-bold text-slate-900">
                      {classes.length}+
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
                      Sessions
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-3xl font-bold text-slate-900">All</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
                      Levels
                    </p>
                  </div>
                </div>

                <a
                  href="/contact"
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-red-600"
                >
                  Join a Class
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </aside>

            <div className="space-y-8">
              {loading ? (
                <div className="rounded-[2rem] border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
                  Loading classes...
                </div>
              ) : classes.length === 0 ? (
                <div className="space-y-6">
                  <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                      <Users className="h-8 w-8" />
                    </div>
                    <h2 className="mt-6 text-4xl font-bold text-slate-900">
                      No classes available right now
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600">
                      Abhi admin dashboard se koi class add nahi hui hai. Jaise hi
                      classes add hongi, wo yahan automatically show hongi.
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                      <a
                        href="/contact"
                        className="rounded-xl bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                      >
                        Contact Us
                      </a>
                      <a
                        href="/plans"
                        className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-red-50"
                      >
                        Explore Plans
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                      <div className="max-w-3xl">
                        <span className="inline-flex rounded-full bg-red-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-500">
                          Featured Class
                        </span>

                        <h2 className="mt-5 text-4xl font-bold text-slate-900">
                          {featuredClass.name}
                        </h2>

                        <p className="mt-4 text-base leading-8 text-slate-600">
                          {featuredClass.description ||
                            "Premium class session designed to improve performance, consistency, and strength."}
                        </p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 lg:w-[420px]">
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                            <Clock3 className="h-4 w-4 text-red-500" />
                            Duration
                          </div>
                          <p className="mt-2 text-sm text-slate-600">
                            {featuredClass.duration || "Flexible"}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                            <Users className="h-4 w-4 text-red-500" />
                            Level
                          </div>
                          <p className="mt-2 text-sm text-slate-600">
                            {featuredClass.level || "All Levels"}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                            <CalendarDays className="h-4 w-4 text-red-500" />
                            Schedule
                          </div>
                          <p className="mt-2 text-sm text-slate-600">
                            {featuredClass.schedule || "To be announced"}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                            <Users className="h-4 w-4 text-red-500" />
                            Trainer
                          </div>
                          <p className="mt-2 text-sm text-slate-600">
                            {featuredClass.trainer || "Expert Coach"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <a
                        href="/contact"
                        className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                      >
                        Join This Class
                        <ArrowRight className="h-4 w-4" />
                      </a>

                      <a
                        href="/plans"
                        className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-red-50"
                      >
                        Explore Plans
                      </a>
                    </div>
                  </div>

                  {otherClasses.length > 0 && (
                    <div className="grid gap-6 md:grid-cols-2">
                      {otherClasses.map((item) => (
                        <div
                          key={item._id}
                          className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-2xl font-bold text-slate-900">
                                {item.name}
                              </h3>
                              <p className="mt-2 text-sm leading-7 text-slate-600">
                                {item.description ||
                                  "Structured class designed for better consistency and stronger routine."}
                              </p>
                            </div>

                            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-500">
                              {item.level || "All Levels"}
                            </span>
                          </div>

                          <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl bg-slate-50 p-4">
                              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                                <Clock3 className="h-4 w-4 text-red-500" />
                                Duration
                              </div>
                              <p className="mt-2 text-sm text-slate-600">
                                {item.duration || "Flexible"}
                              </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4">
                              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                                <CalendarDays className="h-4 w-4 text-red-500" />
                                Schedule
                              </div>
                              <p className="mt-2 text-sm text-slate-600">
                                {item.schedule || "Schedule soon"}
                              </p>
                            </div>
                          </div>

                          <div className="mt-5 flex items-center justify-between text-sm text-slate-600">
                            <span>{item.trainer || "Expert Coach"}</span>
                            <span>{item.status || "Active"}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}