import {
  ArrowRight,
  Dumbbell,
  ShieldCheck,
  Flame,
  Users,
  Trophy,
  HeartPulse,
} from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Dumbbell,
      title: "Premium training spaces",
      text: "Purpose-built workout zones with modern equipment for strength, endurance, and focused performance.",
    },
    {
      icon: ShieldCheck,
      title: "Expert coaching",
      text: "Certified trainers who guide members with better form, structured routines, and practical fitness support.",
    },
    {
      icon: Flame,
      title: "Result-driven culture",
      text: "A motivating gym atmosphere designed for consistency, discipline, and visible transformation.",
    },
  ];

  const stats = [
    { label: "Active Members", value: "2.5K+" },
    { label: "Expert Trainers", value: "20+" },
    { label: "Training Programs", value: "15+" },
    { label: "Transformation Focus", value: "100%" },
  ];

  const reasons = [
    "Premium equipment and clean training zones",
    "Expert coaching for fat loss, strength, and conditioning",
    "High-energy classes that improve consistency",
    "Modern gym experience with smart management support",
    "Serious but friendly environment focused on progress",
    "Flexible plans for different fitness goals and lifestyles",
  ];

  return (
    <div className="bg-[#fffaf7] text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,107,87,0.16),transparent_30%),linear-gradient(to_bottom,#fffaf7,#fff5ef)]" />
        <div className="absolute left-0 top-10 h-40 w-40 rounded-full bg-[#ff6b57]/10 blur-3xl" />
        <div className="absolute right-10 bottom-10 h-40 w-40 rounded-full bg-[#f59e0b]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ff6b57]/20 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#e85b49] shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#ff6b57]" />
                About FitCore
              </div>

              <h1 className="mt-6 max-w-2xl text-3xl font-bold leading-[1.15] text-slate-900 sm:text-4xl lg:text-5xl">
                Fitness designed around
                <span className="block font-extrabold text-[#ff6b57]">
                  discipline, support,
                </span>
                <span className="block font-medium text-slate-600">
                  and transformation.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
                FitCore is built for people who want more than a normal gym.
                We combine premium training spaces, expert coaching, and
                structured routines that help members stay committed and keep progressing.
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
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition duration-300 hover:border-[#ff6b57]/30 hover:bg-[#fff1ec]"
                >
                  Contact Us
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-[2.25rem] border border-white bg-white/70 shadow-xl backdrop-blur-sm" />
              <div className="relative grid gap-4 p-4 sm:grid-cols-2 sm:p-6">
                <div className="overflow-hidden rounded-[2rem] border border-white bg-white shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=80"
                    alt="FitCore gym interior"
                    className="h-80 w-full object-cover transition duration-700 hover:scale-110"
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <div className="rounded-[2rem] border border-[#ff6b57]/10 bg-gradient-to-br from-[#fff1ec] to-[#fff8f3] p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#ff6b57] shadow-sm">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-slate-900">
                      Built for real results
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      A fitness environment focused on strength, consistency,
                      performance, and visible progress.
                    </p>
                  </div>

                  <div className="rounded-[2rem] border border-white bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1ec] text-[#ff6b57]">
                      <HeartPulse className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-slate-900">
                      Energy that keeps you moving
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      From coaching to classes, every part of FitCore is designed
                      to keep motivation high and members engaged.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-[1.75rem] border border-white bg-white/80 px-6 py-6 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-lg"
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

      {/* Values */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#ff6b57]">
              Why FitCore
            </p>
            <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              A premium gym experience with structure and purpose
            </h2>
            <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-base">
              We focus on more than machines. FitCore is designed to help
              members feel guided, motivated, and committed throughout their fitness journey.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {values.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group rounded-[2rem] border border-white bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff1ec] text-[#ff6b57] transition duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reasons */}
      <section className="px-4 pb-24 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] border border-white bg-white/85 p-8 shadow-sm backdrop-blur sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#ff6b57]">
                Member Experience
              </p>
              <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
                Why members choose FitCore
              </h2>
              <p className="mt-5 text-sm leading-8 text-slate-600 sm:text-base">
                Our goal is to create a gym environment where members can train
                with confidence, enjoy the process, and stay consistent for the long term.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {reasons.map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.5rem] border border-slate-100 bg-[#fffaf7] p-5 text-sm leading-7 text-slate-600 transition duration-300 hover:border-[#ff6b57]/20 hover:bg-[#fff1ec]"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#ff6b57] shadow-sm">
                      <Users className="h-5 w-5" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-white bg-white shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80"
                alt="Gym training"
                className="h-full min-h-[520px] w-full object-cover transition duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}