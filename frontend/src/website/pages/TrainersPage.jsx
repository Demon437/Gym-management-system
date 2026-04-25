import { useEffect, useState } from "react";
import {
  ArrowRight,
  Dumbbell,
  ShieldCheck,
  Trophy,
  Users,
  Star,
  Award,
  Mail,
  Phone,
} from "lucide-react";
import { getAllTrainers } from "../../api/trainerApi";

const getImageUrl = (path, name = "Trainer") => {
  if (!path) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=f3f4f6&color=111827&size=400`;
  }
  if (path.startsWith("http")) return path;
  return `http://localhost:5000${path}`;
};

export default function TrainersPage() {
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const data = await getAllTrainers();
        setTrainers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Trainer fetch error:", error);
      }
    };

    fetchTrainers();
  }, []);

  const highlights = [
    {
      icon: Dumbbell,
      title: "Specialized guidance",
      text: "Our coaches help members train smarter with better form, focus, and structure.",
    },
    {
      icon: ShieldCheck,
      title: "Professional support",
      text: "From beginners to advanced members, trainers provide support tailored to each goal.",
    },
    {
      icon: Trophy,
      title: "Transformation mindset",
      text: "Every trainer is committed to helping members stay consistent and achieve visible results.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#fff8f7] to-[#f7f8fc] px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-20">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-red-100 blur-3xl" />
        <div className="absolute right-0 top-10 h-80 w-80 rounded-full bg-blue-100 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-red-500">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Our Trainers
              </div>

              <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-[1.1] text-slate-900 sm:text-5xl lg:text-6xl">
                Coach-led training
                <span className="block text-red-500">with premium support</span>
                <span className="block text-slate-600">for every fitness goal.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Meet the specialists helping our members grow stronger, fitter,
                and more confident through structured guidance, motivation, and
                consistent coaching support.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="/plans"
                  className="group inline-flex items-center gap-2 rounded-xl bg-red-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition duration-300 hover:-translate-y-1 hover:bg-red-600"
                >
                  Explore Memberships
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </a>

                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition duration-300 hover:border-red-200 hover:bg-red-50"
                >
                  Contact Us
                </a>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-lg"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-slate-900">
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

          {/* Stats */}
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Expert Trainers", value: `${trainers.length || 0}+` },
              { label: "Member Support", value: "Daily" },
              { label: "Training Styles", value: "Multiple" },
              { label: "Goal Focus", value: "100%" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="text-3xl font-bold text-slate-900">{item.value}</div>
                <div className="mt-2 text-sm uppercase tracking-[0.18em] text-slate-500">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRAINERS GRID */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-red-500">
              Meet Our Team
            </p>
            <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              Dedicated professionals behind every member transformation
            </h2>
            <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-base">
              Our trainers are here to bring motivation, practical knowledge,
              and personalized guidance so members can train with confidence.
            </p>
          </div>

          {trainers.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {trainers.map((trainer) => (
                <div
                  key={trainer._id}
                  className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-[#f8f9fb] shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-lg"
                >
                  {/* IMAGE */}
                  <div className="relative overflow-hidden">
                    <img
                      src={getImageUrl(trainer.image, trainer.name)}
                      alt={trainer.name}
                      className="h-80 w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-red-500 shadow-sm">
                      {trainer.experience || "Trainer"}
                    </div>

                    <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                      {trainer.status || "Active"}
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">
                          {trainer.name || "Trainer Name"}
                        </h3>
                        <p className="mt-2 text-sm uppercase tracking-[0.16em] text-red-500">
                          {trainer.specialization || trainer.role || "Fitness Coach"}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-red-50 p-3 text-red-500">
                        <Users className="h-5 w-5" />
                      </div>
                    </div>

                    {/* RATING */}
                    {(trainer.rating ?? 0) > 0 && (
                      <div className="mt-4 flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(Number(trainer.rating))
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-slate-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-semibold text-slate-700">
                          {trainer.rating}
                        </span>
                      </div>
                    )}

                    {/* BIO */}
                    <p className="mt-4 line-clamp-4 text-sm leading-7 text-slate-600">
                      {trainer.bio ||
                        trainer.description ||
                        "A dedicated fitness professional focused on helping members improve their strength, confidence, and consistency."}
                    </p>

                    {/* STATS */}
                    <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-200 pt-5">
                      <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <p className="text-xs uppercase tracking-[0.12em] text-slate-500">
                          Members
                        </p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">
                          {trainer.assignedMembers || 0}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <p className="text-xs uppercase tracking-[0.12em] text-slate-500">
                          Sessions
                        </p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">
                          {trainer.sessionsCompleted || 0}
                        </p>
                      </div>
                    </div>

                    {/* EXPERIENCE */}
                    {trainer.experience && (
                      <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                        <Award className="h-4 w-4 text-red-500" />
                        <span>{trainer.experience} experience</span>
                      </div>
                    )}

                    {/* CERTIFICATIONS */}
                    {trainer.certifications?.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {trainer.certifications.map((cert, index) => (
                          <span
                            key={index}
                            className="rounded-full bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700 shadow-sm"
                          >
                            {cert}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* CONTACT */}
                    <div className="mt-5 space-y-2 border-t border-slate-200 pt-5 text-sm text-slate-600">
                      {trainer.email && (
                        <p className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-red-500" />
                          <span className="truncate">{trainer.email}</span>
                        </p>
                      )}

                      {trainer.phone && (
                        <p className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-red-500" />
                          <span>{trainer.phone}</span>
                        </p>
                      )}
                    </div>

                    {/* TAGS */}
                    <div className="mt-6 flex flex-wrap gap-3">
                      <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700 shadow-sm">
                        Expert Guidance
                      </span>
                      <span className="rounded-full bg-red-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-red-500">
                        Member Focused
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-[#f8f9fb] p-12 text-center text-slate-500">
              No trainers available right now.
            </div>
          )}
        </div>
      </section>

      {/* EXTRA SECTION */}
      <section className="bg-[#f8f9fb] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-red-500">
              Coaching Experience
            </p>
            <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              Why training with our experts feels different
            </h2>
            <p className="mt-5 text-sm leading-8 text-slate-600 sm:text-base">
              At FitCore, members don’t just get access to a gym floor. They get
              meaningful support, coaching structure, and a motivating fitness environment.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "Better guidance during workouts",
                "Improved form and safer training",
                "More motivation and accountability",
                "Support for strength and transformation goals",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.5rem] border border-slate-200 bg-[#f8f9fb] p-5 text-sm leading-7 text-slate-600 transition duration-300 hover:border-red-100 hover:bg-red-50"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-red-500 shadow-sm">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80"
              alt="Trainer coaching member"
              className="h-full min-h-[520px] w-full object-cover transition duration-700 hover:scale-105"
            />
          </div>
        </div>
      </section>
    </div>
  );
}