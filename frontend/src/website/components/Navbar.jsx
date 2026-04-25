import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Dumbbell } from "lucide-react";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Trainers", path: "/trainers" },
  { name: "Plans", path: "/plans" },
  { name: "Classes", path: "/classes" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, []);

  const headerClasses = scrolled
    ? "bg-[#0b1220]/95 backdrop-blur-xl border-b border-white/10 shadow-lg"
    : "bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm";

  const brandTitleClasses = scrolled ? "text-white" : "text-slate-900";
  const brandSubtitleClasses = scrolled ? "text-slate-300" : "text-slate-500";
  const mobileButtonClasses = scrolled
    ? "border-white/10 bg-white/5 text-white"
    : "border-slate-200 bg-white text-slate-900";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerClasses}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30">
            <Dumbbell size={20} />
          </div>

        

          <div>
            <h1 className={`text-xl font-bold tracking-wide ${brandTitleClasses}`}>
              Webix_Gym
            </h1>
            <p className={`text-xs ${brandSubtitleClasses}`}>
              Premium Gym Experience
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive
                    ? "text-red-500"
                    : scrolled
                    ? "text-slate-200 hover:text-white"
                    : "text-slate-700 hover:text-slate-900"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          {/* <Link
            to="/contact"
            className="rounded-full bg-gradient-to-r from-red-500 to-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/30 transition hover:-translate-y-0.5"
          >
            Join Now
          </Link> */}
        </nav>


        <button
          onClick={() => setOpen(!open)}
          className={`rounded-xl border p-2 transition md:hidden ${mobileButtonClasses}`}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div
          className={`border-t px-4 py-4 md:hidden ${
            scrolled
              ? "border-white/10 bg-[#0b1220]"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-medium transition ${
                    isActive
                      ? "text-red-500"
                      : scrolled
                      ? "text-slate-200 hover:text-white"
                      : "text-slate-700 hover:text-slate-900"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            

            {/* <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="inline-flex w-fit items-center rounded-full bg-gradient-to-r from-red-500 to-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/30"
            >
              Join Now
            </Link> */}
          </div>
        </div>
      )}
    </header>
  );
}