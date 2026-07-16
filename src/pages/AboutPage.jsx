import React from "react";
import { CheckCircle, ShieldCheck, Package, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  const features = [
    {
      icon: CheckCircle,
      text: "100% genuine, quality-checked medicines and health products.",
    },
    {
      icon: ShieldCheck,
      text: "Prescription verification by licensed pharmacists for safety and compliance.",
    },
    {
      icon: Package,
      text: "Discrete, tamper-proof packaging and contact-less delivery.",
    },
    {
      icon: CreditCard,
      text: "Transparent pricing with secure, encrypted payments via Stripe.",
    },
  ];

  return (
    <div className="min-h-screen bg-sky-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-md border border-sky-100 p-8 space-y-6">
        <h1 className="text-3xl font-extrabold text-sky-900 mb-2">
          About Medicity
        </h1>
        <p className="text-sm text-sky-800">
          Medicity is a modern online pharmacy built to make healthcare
          accessible, affordable and safe for everyone. Our mission is to
          combine trustworthy medicines with a seamless digital experience, so
          you can focus on your health while we take care of everything else.
        </p>

        <h2 className="text-xl font-semibold text-sky-900 mt-6 mb-4">
          What we stand for
        </h2>
        <ul className="space-y-3">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <li
                key={idx}
                className="flex items-center gap-2 text-sm text-sky-800"
              >
                <Icon className="text-emerald-600 w-5 h-5 flex-shrink-0" />
                {f.text}
              </li>
            );
          })}
        </ul>

        <h2 className="text-xl font-semibold text-sky-900 mt-6 mb-3">
          Why customers trust us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-sky-800">
          <div className="bg-sky-50 rounded-2xl p-4 shadow-sm border border-sky-100">
            Scalable MERN architecture with strict security practices.
          </div>
          <div className="bg-sky-50 rounded-2xl p-4 shadow-sm border border-sky-100">
            JWT-based authentication and end-to-end encrypted payment flows.
          </div>
          <div className="bg-sky-50 rounded-2xl p-4 shadow-sm border border-sky-100">
            From chronic care to daily wellness products, Medicity is your
            reliable healthcare partner.
          </div>
          <div className="bg-sky-50 rounded-2xl p-4 shadow-sm border border-sky-100">
            Transparent pricing with no hidden charges.
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/products"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition"
          >
            Shop Medicines
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
