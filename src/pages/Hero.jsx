import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Truck, ShieldCheck, Headset, ArrowRight, Pill } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-sky-50 via-white to-emerald-50">
      <div className="absolute left-0 top-0 -z-10 h-40 w-40 sm:h-56 sm:w-56 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="absolute bottom-0 right-0 -z-10 h-40 w-40 sm:h-56 sm:w-56 rounded-full bg-emerald-200/40 blur-3xl" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:px-8 lg:py-20">
        {/* Left Content */}
        <div className="max-w-2xl text-center lg:text-left">
          <p className="mb-3 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] sm:tracking-[0.35em] text-emerald-600">
            Welcome to Medicity
          </p>

          <h1 className="text-3xl font-extrabold leading-tight text-sky-900 xs:text-4xl sm:text-5xl lg:text-6xl">
            Your Trusted{" "}
            <span className="text-emerald-600">Online Pharmacy</span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-700 sm:mt-6 sm:text-base lg:mx-0">
            Order genuine medicines, prescription drugs, and wellness essentials
            with confidence. Verified by licensed pharmacists and delivered with
            care.
          </p>

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
            <button
              onClick={() => navigate("/products")}
              className="min-h-[48px] w-full flex-1 rounded-2xl border border-sky-200 bg-white px-4 py-3 text-left text-sm text-slate-500 shadow-sm transition hover:border-sky-400 hover:shadow-md"
            >
              Search medicines, brands...
            </button>

            <Link
              to="/products"
              className="inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-sky-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-sky-800"
            >
              Browse Medicines
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Trust Cards */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-3">
            <TrustItem
              icon={<Truck size={18} />}
              title="Fast Delivery"
              copy="Same-day in select cities"
              tone="sky"
            />

            <TrustItem
              icon={<ShieldCheck size={18} />}
              title="100% Genuine"
              copy="Verified & licensed"
              tone="emerald"
            />

            <TrustItem
              icon={<Headset size={18} />}
              title="24/7 Support"
              copy="Pharmacist help"
              tone="sky"
            />
          </div>
        </div>

        {/* Right Card */}
        <div className="relative">
          <div className="overflow-hidden rounded-3xl border border-sky-100 bg-white/90 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-7 lg:p-8">
            {/* Badge */}
            <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              Trusted by Licensed Pharmacists
            </span>

            {/* Header */}
            <div className="mt-5 flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
                  Prescription Support
                </p>

                <h3 className="mt-2 text-xl font-bold leading-tight text-sky-900 lg:text-2xl">
                  Verified Prescription Medicines
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Upload your doctor's prescription securely. Our licensed
                  pharmacists verify every order before dispatch.
                </p>
              </div>

              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Pill size={30} />
              </div>
            </div>

            {/* Features */}
            <div className="mt-8 space-y-4">
              {[
                "Prescription required only for select medicines",
                "Upload when prompted during checkout",
                "Verified by licensed pharmacists",
                "100% secure and compliant process",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="mt-2 h-2 w-2 rounded-full bg-emerald-500"></div>
                  <p className="text-sm text-slate-700">{item}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              to="/prescription-medicines"
              className="mt-8 flex h-12 w-full items-center justify-center rounded-2xl bg-emerald-600 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Explore Prescription Medicines
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const TrustItem = ({ icon, title, copy, tone }) => {
  const colorClass =
    tone === "emerald"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-sky-100 text-sky-700";

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm">
      <div className={`rounded-xl p-2.5 flex-shrink-0 ${colorClass}`}>
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-slate-600">{copy}</p>
      </div>
    </div>
  );
};

export default Hero;
