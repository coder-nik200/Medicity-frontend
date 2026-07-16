import React from "react";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Rahul Sharma",
      location: "Delhi",
      text: "Fast delivery and genuine medicines. I could track my order at every step.",
    },
    {
      name: "Ananya Mehta",
      location: "Mumbai",
      text: "Prescription upload was simple, and the pharmacist even called to confirm dosage.",
    },
    {
      name: "Vikram Reddy",
      location: "Bengaluru",
      text: "Great discounts on monthly medicines and very professional packaging.",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-sky-50 to-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-sky-900">
            What Our Customers Say 💙
          </h2>
          <p className="text-sky-600 mt-2">Trusted by thousands across India</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="relative bg-white/80 backdrop-blur-md border border-sky-100 
              rounded-3xl shadow-lg p-6 hover:shadow-xl hover:-translate-y-2 
              transition-all duration-300 flex flex-col gap-4"
            >
              {/* Quote Icon */}
              <Quote
                className="absolute top-5 right-5 text-sky-100"
                size={50}
              />

              {/* Stars */}
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#fbbf24" stroke="none" />
                ))}
              </div>

              {/* Text */}
              <p className="text-sky-800 text-sm leading-relaxed z-10">
                “{t.text}”
              </p>

              {/* User Info */}
              <div className="flex items-center gap-3 mt-4">
                <div className="w-10 h-10 rounded-full bg-sky-200 flex items-center justify-center font-semibold text-sky-700">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-sky-900">{t.name}</p>
                  <p className="text-xs text-sky-500">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
