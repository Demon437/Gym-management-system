import { Dumbbell, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#08101c] text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white">
              <Dumbbell size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Webix_Gym</h3>
              <p className="text-sm text-slate-400">Gym Management & Fitness</p>
            </div>
          </div>
          <p className="text-sm leading-6 text-slate-400">
            Premium fitness destination with expert trainers, modern equipment, and motivating classes.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white">Quick Links</h4>
          <div className="flex flex-col gap-3 text-sm">
            <Link to="/about">About</Link>
            <Link to="/trainers">Trainers</Link>
            <Link to="/plans">Plans</Link>
            <Link to="/classes">Classes</Link>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white">Contact</h4>
          <div className="space-y-3 text-sm">
            <p className="flex items-start gap-3"><MapPin size={16} className="mt-0.5" /> 123 Premium Fitness Street, New Delhi</p>
            <p className="flex items-center gap-3"><Phone size={16} /> +91 98765 43210</p>
            <p className="flex items-center gap-3"><Mail size={16} /> hello@webixgym.com</p>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white">Hours</h4>
          <div className="space-y-2 text-sm text-slate-400">
            <p>Mon - Fri: 6:00 AM - 10:00 PM</p>
            <p>Sat: 7:00 AM - 9:00 PM</p>
            <p>Sun: 8:00 AM - 6:00 PM</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-sm text-slate-500">
        © 2026 Webix_Gym. All rights reserved.
      </div>
    </footer>
  );
}