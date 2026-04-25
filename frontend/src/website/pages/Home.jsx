import { useEffect, useState } from "react";
import {
  ArrowRight,
  Dumbbell,
  ShieldCheck,
  Flame,
  Star,
  Clock3,
  Users,
  Trophy,
} from "lucide-react";
import { getAllTrainers } from "../../api/trainerApi";
import { getPlans } from "../../api/planApi";
import { getAllClasses } from "../../api/classApi";

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `http://localhost:5000${path}`;
};

export default function Home() {
  const [trainers, setTrainers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trainerData, planData, classData] = await Promise.all([
          getAllTrainers(),
          getPlans(),
          getAllClasses(),
        ]);

        setTrainers(Array.isArray(trainerData) ? trainerData.slice(0, 4) : []);
        setPlans(Array.isArray(planData) ? planData.slice(0, 3) : []);
        setClasses(Array.isArray(classData) ? classData.slice(0, 4) : []);
      } catch (error) {
        console.error("Home page fetch error:", error);
      }
    };

    fetchData();
  }, []);

  const highlights = [
    {
      icon: Dumbbell,
      title: "Elite training zone",
      text: "Modern workout spaces designed for strength, endurance, and focused performance.",
    },
    {
      icon: ShieldCheck,
      title: "Certified coaches",
      text: "Professional trainers who help members stay safe, structured, and consistent.",
    },
    {
      icon: Flame,
      title: "Result-driven programs",
      text: "Plans created for fat loss, muscle gain, conditioning, and transformation.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fffaf7] text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,99,71,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.14),transparent_24%),linear-gradient(to_bottom,#fffaf7,#fff5ef)]" />
        <div className="absolute left-10 top-24 h-40 w-40 rounded-full bg-[#ff6b57]/15 blur-3xl animate-pulse" />
        <div className="absolute right-10 bottom-20 h-40 w-40 rounded-full bg-[#f59e0b]/10 blur-3xl animate-pulse" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-28 lg:pt-16">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#ff6b57]/20 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#e85b49] shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#ff6b57] animate-pulse" />
              FitCore Premium Gym
            </div>

            <h1 className="mt-6 max-w-2xl text-3xl font-bold leading-[1.12] text-slate-900 sm:text-4xl lg:text-6xl">
              Build a body
              <span className="block text-[#ff6b57] font-extrabold">
                that looks strong
              </span>
              <span className="block text-slate-600 font-medium">
                and feels unstoppable.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              FitCore is a premium fitness space built for disciplined training,
              expert guidance, and a motivating environment that helps members
              stay consistent and see real progress.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/plans"
                className="group inline-flex items-center gap-2 rounded-full bg-[#ff6b57] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#ff6b57]/20 transition duration-300 hover:scale-105 hover:bg-[#ff7b69]"
              >
                Explore Memberships
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </a>

              <a
                href="/classes"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition duration-300 hover:border-[#ff6b57]/30 hover:bg-[#fff1ec]"
              >
                View Classes
              </a>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Members", value: "2.5K+" },
                { label: "Coaches", value: "20+" },
                { label: "Programs", value: "15+" },
                { label: "Results", value: "Real" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.5rem] border border-white bg-white/80 px-4 py-5 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="text-2xl font-bold text-slate-900">
                    {item.value}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex min-h-[540px] items-center justify-center">
            <div className="absolute inset-0 rounded-[2.5rem] border border-white bg-white/70 shadow-xl backdrop-blur-sm" />

            <div className="relative h-full w-full p-4 sm:p-6">
              <div className="grid h-full gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-4">
                  <div className="group relative overflow-hidden rounded-[2rem] border border-white bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-xl">
                    <img
                      src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=80"
                      alt="Gym workout"
                      className="h-64 w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-[#ffd9d3]">
                        Performance
                      </p>
                      <h3 className="mt-2 text-xl font-bold text-white">
                        Strength. Focus. Consistency.
                      </h3>
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-white bg-white p-5 shadow-sm transition duration-300 hover:scale-[1.02] hover:shadow-lg">
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl bg-[#fff1ec] p-3 text-[#ff6b57]">
                        <Trophy className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-slate-900">
                          Result-driven coaching
                        </h4>
                        <p className="mt-2 text-sm leading-7 text-slate-600">
                          Premium support for transformation, weight loss,
                          strength, and long-term consistency.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 pt-8 sm:pt-12">
                  <div className="rounded-[2rem] border border-[#ff6b57]/10 bg-gradient-to-br from-[#fff1ec] to-[#fff8f3] p-5 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#e85b49]">
                        Premium Energy
                      </p>
                      <Star className="h-5 w-5 text-[#ff6b57]" />
                    </div>
                    <h3 className="mt-4 text-2xl font-bold text-slate-900">
                      A gym experience that feels different
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      Clean design, focused culture, and a motivating atmosphere
                      that makes training more enjoyable.
                    </p>
                  </div>

                  <div className="group relative overflow-hidden rounded-[2rem] border border-white bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-xl">
                    <img
                      src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80"
                      alt="Fitness training"
                      className="h-72 w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/20 bg-white/15 p-4 backdrop-blur-md">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">
                          Live group sessions
                        </span>
                        <span className="rounded-full bg-[#ff6b57] px-3 py-1 text-xs font-semibold text-white">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white bg-white/90 px-5 py-3 text-sm font-medium text-slate-800 shadow-xl backdrop-blur-md transition duration-300 hover:scale-105">
                Built for serious fitness journeys
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="relative z-10 -mt-4 pb-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="rounded-[2rem] border border-white bg-white/80 p-8 shadow-sm backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#ff6b57]">
              Why members stay
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
              More than machines.
              <br />
              It is the full training atmosphere.
            </h2>
            <p className="mt-5 text-sm leading-8 text-slate-600">
              FitCore creates an environment where members feel pushed,
              supported, and excited to return. Every part of the space is
              designed to help people stay motivated.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {[
                "Fat Loss",
                "Muscle Gain",
                "Strength",
                "Cardio",
                "Mobility",
                "Group Training",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#ff6b57]/15 bg-[#fff1ec] px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#e85b49] transition duration-300 hover:scale-105"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group rounded-[2rem] border border-white bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff1ec] text-[#ff6b57] transition duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TRAINERS */}
      <section className="bg-[#fff5ef] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="lg:sticky lg:top-24 lg:h-fit">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#ff6b57]">
                Elite Coaches
              </p>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
                Meet the people who shape member results
              </h2>
              <p className="mt-5 text-sm leading-8 text-slate-600">
                Our trainers bring energy, knowledge, and structured guidance to
                every workout experience.
              </p>
              <a
                href="/trainers"
                className="mt-7 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition duration-300 hover:border-[#ff6b57]/30 hover:bg-[#fff1ec]"
              >
                View All Trainers
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {trainers.length > 0 ? (
                trainers.map((trainer, index) => {
                  const trainerImage = getImageUrl(
                    trainer.avatar || trainer.image
                  );

                  return (
                    <div
                      key={trainer._id}
                      className={`group overflow-hidden rounded-[2rem] border border-white bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl ${
                        index % 2 !== 0 ? "sm:translate-y-10" : ""
                      }`}
                    >
                      {trainerImage && (
                        <div className="relative overflow-hidden">
                          <img
                            src={trainerImage}
                            alt={trainer.name}
                            className="h-80 w-full object-cover transition duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                        </div>
                      )}

                      <div className="p-6">
                        <h3 className="text-2xl font-bold text-slate-900">
                          {trainer.name || "Trainer Name"}
                        </h3>
                        <p className="mt-2 text-sm uppercase tracking-[0.2em] text-[#e85b49]">
                          {trainer.specialization ||
                            trainer.role ||
                            "Fitness Coach"}
                        </p>
                        <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-600">
                          {trainer.bio ||
                            trainer.description ||
                            "Professional trainer focused on performance, guidance, and sustainable transformation."}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500 sm:col-span-2">
                  No trainers available right now.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PLANS */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,107,87,0.08),transparent_25%),linear-gradient(to_bottom,#fff5ef,#fffaf7)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#ff6b57]">
              Membership Plans
            </p>
            <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              Pick the plan that fits your routine
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-slate-600">
              Flexible plans for beginners, regular gym-goers, and serious
              transformation seekers.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {plans.length > 0 ? (
              plans.map((plan, index) => (
                <div
                  key={plan._id}
                  className={`group rounded-[2rem] border p-8 transition duration-300 hover:-translate-y-2 ${
                    index === 1
                      ? "scale-100 border-[#ff6b57]/15 bg-[#fff1ec] shadow-xl lg:scale-105"
                      : "border-white bg-white shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-slate-900">
                      {plan.name || "Membership"}
                    </h3>
                    {index === 1 && (
                      <span className="rounded-full bg-[#ff6b57] px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-white">
                        Popular
                      </span>
                    )}
                  </div>

                  <div className="mt-6 flex items-end gap-2">
                    <span className="text-4xl font-black text-slate-900">
                      ₹{plan.price || 0}
                    </span>
                    <span className="pb-1 text-sm text-slate-500">
                      / {plan.duration || "month"}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {plan.description ||
                      "A flexible membership built for training consistency and visible results."}
                  </p>

                  <div className="mt-8 space-y-3">
                    {(plan.features?.length ? plan.features : [])
                      .slice(0, 4)
                      .map((feature, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 text-sm text-slate-700"
                        >
                          <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b57]" />
                          <span>{feature}</span>
                        </div>
                      ))}
                  </div>

                  <a
                    href="/plans"
                    className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-300 ${
                      index === 1
                        ? "bg-[#ff6b57] text-white hover:bg-[#ff7b69]"
                        : "border border-slate-200 bg-white text-slate-800 hover:border-[#ff6b57]/30 hover:bg-[#fff1ec]"
                    }`}
                  >
                    Choose Plan
                  </a>
                </div>
              ))
            ) : (
              <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500 lg:col-span-3">
                No plans available right now.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CLASSES */}
      <section className="bg-[#fffaf7] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#ff6b57]">
                Popular Classes
              </p>
              <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
                High-energy sessions that keep members engaged
              </h2>
            </div>
            <a
              href="/classes"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#e85b49] transition duration-300 hover:gap-3"
            >
              Explore All Classes
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {classes.length > 0 ? (
              classes.map((item) => {
                const classImage = getImageUrl(
                  item.image || item.trainerImage || item.trainer?.avatar
                );

                return (
                  <div
                    key={item._id}
                    className={`group overflow-hidden rounded-[2rem] border border-white bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl ${
                      classImage ? "sm:grid sm:grid-cols-[0.95fr_1.05fr]" : ""
                    }`}
                  >
                    {classImage && (
                      <div className="overflow-hidden">
                        <img
                          src={classImage}
                          alt={item.name}
                          className="h-72 w-full object-cover transition duration-700 group-hover:scale-110"
                        />
                      </div>
                    )}

                    <div className="flex flex-col justify-between p-6">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">
                          {item.name || "Fitness Class"}
                        </h3>
                        <p className="mt-4 text-sm leading-7 text-slate-600">
                          {item.description ||
                            "An engaging class designed to improve stamina, strength, and discipline."}
                        </p>
                      </div>

                      <div className="mt-8 flex flex-wrap gap-3">
                        <span className="inline-flex items-center gap-2 rounded-full bg-[#fff1ec] px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-700">
                          <Clock3 className="h-4 w-4 text-[#ff6b57]" />
                          {item.time || item.duration || "Flexible Timing"}
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-[#fff1ec] px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-700">
                          <Users className="h-4 w-4 text-[#ff6b57]" />
                          {item.level || "All Levels"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500 lg:col-span-2">
                No classes available right now.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-[#fff1ec] via-[#fff7f2] to-[#fff3ea]" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2.5rem] border border-white bg-white/85 p-8 text-center shadow-xl backdrop-blur-md sm:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#ff6b57]">
              Start Today
            </p>
            <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-5xl">
              Join FitCore and transform your training routine
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-slate-600 sm:text-base">
              Take the next step with premium facilities, expert guidance, and
              programs designed for real progress.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="/plans"
                className="rounded-full bg-[#ff6b57] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#ff6b57]/20 transition duration-300 hover:scale-105 hover:bg-[#ff7b69]"
              >
                Join Now
              </a>
              <a
                href="/contact"
                className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition duration-300 hover:border-[#ff6b57]/30 hover:bg-[#fff1ec]"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}