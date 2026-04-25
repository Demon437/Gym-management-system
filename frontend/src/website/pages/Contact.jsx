import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock3,
  ArrowRight
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000/api";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Membership Plan",
    message: ""
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setSuccessMessage("");
  setErrorMessage("");

  if (!formData.name.trim()) {
    setErrorMessage("Please enter your full name.");
    return;
  }

  if (!formData.email.trim()) {
    setErrorMessage("Please enter your email address.");
    return;
  }

  if (!formData.message.trim()) {
    setErrorMessage("Please enter your message.");
    return;
  }

  try {
    setSubmitting(true);

    const response = await fetch(`${API_BASE_URL}/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        message: formData.message
      })
    });

    const contentType = response.headers.get("content-type") || "";
    const rawText = await response.text();

    let result = {};

    if (rawText) {
      if (contentType.includes("application/json")) {
        result = JSON.parse(rawText);
      } else {
        throw new Error(
          `Invalid response from server. Check /api/inquiries route. Response starts with: ${rawText.slice(0, 80)}`
        );
      }
    }

    if (!response.ok) {
      throw new Error(result.message || "Failed to send inquiry");
    }

    setSuccessMessage("Inquiry sent successfully. Our team will contact you soon.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      service: "Membership Plan",
      message: ""
    });
  } catch (error) {
    console.error("Inquiry submit error:", error);
    setErrorMessage(error.message || "Something went wrong. Please try again.");
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-900">
      <section className="relative overflow-hidden px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-red-100/70 blur-3xl" />
        <div className="absolute right-0 top-16 h-80 w-80 rounded-full bg-orange-100/60 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-red-500">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Contact
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-[1.08] text-slate-900 sm:text-5xl lg:text-6xl">
              Start your fitness
              <span className="block text-red-500">journey with FitCore</span>
              <span className="block text-slate-600">in a better way.</span>
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
              Visit our gym, connect with our team, and find the right plan,
              class, or coaching support for your goals. We are here to help
              you get started with confidence.
            </p>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-500">
                  Get in touch
                </p>

                <h2 className="mt-4 text-3xl font-bold text-slate-900">
                  We would love to hear from you
                </h2>

                <p className="mt-4 text-sm leading-8 text-slate-600">
                  Whether you want to join, ask about memberships, or explore
                  classes, our team is ready to guide you.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-[#f8f9fb] p-4">
                    <div className="rounded-2xl bg-red-50 p-3 text-red-500">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Address</p>
                      <p className="mt-1 text-sm leading-7 text-slate-600">
                        123 Premium Fitness Street, New Delhi
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-[#f8f9fb] p-4">
                    <div className="rounded-2xl bg-red-50 p-3 text-red-500">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Phone</p>
                      <p className="mt-1 text-sm leading-7 text-slate-600">
                        +91 98765 43210
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-[#f8f9fb] p-4">
                    <div className="rounded-2xl bg-red-50 p-3 text-red-500">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Email</p>
                      <p className="mt-1 text-sm leading-7 text-slate-600">
                        hello@fitcore.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-[#f8f9fb] p-4">
                    <div className="rounded-2xl bg-red-50 p-3 text-red-500">
                      <Clock3 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Hours</p>
                      <div className="mt-1 space-y-1 text-sm leading-7 text-slate-600">
                        <p>Mon - Fri: 6:00 AM - 10:00 PM</p>
                        <p>Sat: 7:00 AM - 9:00 PM</p>
                        <p>Sun: 8:00 AM - 6:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
              <div className="max-w-2xl">
                <h2 className="mt-4 text-3xl font-bold text-slate-900">
                  Tell us about your fitness goal
                </h2>
                <p className="mt-4 text-sm leading-8 text-slate-600">
                  Share your details and we will help you find the best option
                  based on your routine, experience, and fitness goals.
                </p>
              </div>

              <form className="mt-8" onSubmit={handleSubmit}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="w-full rounded-xl border border-slate-200 bg-[#f8f9fb] px-4 py-3 text-slate-900 outline-none transition duration-300 placeholder:text-slate-400 focus:border-red-300 focus:bg-white"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="w-full rounded-xl border border-slate-200 bg-[#f8f9fb] px-4 py-3 text-slate-900 outline-none transition duration-300 placeholder:text-slate-400 focus:border-red-300 focus:bg-white"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone"
                      className="w-full rounded-xl border border-slate-200 bg-[#f8f9fb] px-4 py-3 text-slate-900 outline-none transition duration-300 placeholder:text-slate-400 focus:border-red-300 focus:bg-white"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Interested In
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-[#f8f9fb] px-4 py-3 text-slate-900 outline-none transition duration-300 focus:border-red-300 focus:bg-white"
                    >
                      <option value="Membership Plan">Membership Plan</option>
                      <option value="Classes">Classes</option>
                      <option value="Personal Training">Personal Training</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Message
                    </label>
                    <textarea
                      rows="6"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your fitness goal"
                      className="w-full rounded-xl border border-slate-200 bg-[#f8f9fb] px-4 py-3 text-slate-900 outline-none transition duration-300 placeholder:text-slate-400 focus:border-red-300 focus:bg-white"
                    />
                  </div>
                </div>

                {successMessage ? (
                  <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {successMessage}
                  </div>
                ) : null}

                {errorMessage ? (
                  <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorMessage}
                  </div>
                ) : null}

                <div className="mt-8 flex flex-wrap gap-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition duration-300 hover:-translate-y-1 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitting ? "Sending..." : "Send Inquiry"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">Visit the gym</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Take a tour of the facility, explore workout zones, and talk to our team directly.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">Choose a plan</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                We can help you select the membership that fits your schedule and goals.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">Join a class</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Explore our active sessions and find classes that keep your training routine exciting.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}