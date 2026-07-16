import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Truck, ShieldCheck, Headset, ArrowRight, Pill } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-sky-50 via-white to-emerald-50 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-sky-200 rounded-full blur-3xl opacity-30 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-200 rounded-full blur-3xl opacity-30 -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 grid md:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div>
          <p className="text-xs font-semibold tracking-[0.35em] text-emerald-600 uppercase mb-5">
            Welcome to Medicity
          </p>

          <h1 className="text-4xl md:text-6xl font-extrabold text-sky-900 leading-tight">
            Your Trusted{" "}
            <span className="text-emerald-600">Online Pharmacy</span>
          </h1>

          <p className="mt-6 text-sky-800 text-base leading-relaxed max-w-xl">
            Order genuine medicines, prescription drugs, and wellness products
            with confidence. All prescription medicines are verified by licensed
            pharmacists before delivery.
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/products")}
              className="flex-1 text-left px-6 py-4 rounded-2xl border border-sky-200 bg-white shadow-md hover:ring-2 hover:ring-sky-400 text-sm text-gray-500 transition"
            >
              Search medicines, brands...
            </button>

            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-sky-700 text-white font-semibold shadow-lg hover:bg-sky-800 transition"
            >
              Browse Medicines <ArrowRight size={18} />
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-sky-100 text-sky-700">
                <Truck size={20} />
              </div>
              <div>
                <p className="font-semibold text-sky-900">Fast Delivery</p>
                <p className="text-xs text-sky-600">
                  Same-day in select cities
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="font-semibold text-sky-900">100% Genuine</p>
                <p className="text-xs text-sky-600">
                  Verified & licensed sources
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-sky-100 text-sky-700">
                <Headset size={20} />
              </div>
              <div>
                <p className="font-semibold text-sky-900">24/7 Support</p>
                <p className="text-xs text-sky-600">
                  Pharmacist assistance
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Prescription Info Card */}
        <div className="relative">
          <div className="bg-white/90 backdrop-blur-xl border border-sky-100 rounded-3xl shadow-2xl p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-emerald-600">
                  Prescription Support
                </p>
                <p className="text-lg font-semibold text-sky-900">
                  Verified Prescription Medicines
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
                <Pill size={28} />
              </div>
            </div>

            <div className="space-y-3 text-sm text-sky-800">
              <p>• Prescription required only for select medicines</p>
              <p>• Upload when prompted during order</p>
              <p>• Verified by licensed pharmacists</p>
              <p>• Secure & compliant with regulations</p>
            </div>

            <Link
              to="/prescription-medicines"
              className="block text-center border border-emerald-600 text-emerald-700 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition"
            >
              Explore Prescription Medicines
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;