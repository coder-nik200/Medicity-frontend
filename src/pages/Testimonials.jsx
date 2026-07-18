import React from "react";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Shubham Kumar",
      location: "Delhi",
      text: "Fast delivery and genuine medicines. I could track my order at every step.",
    },
    {
      name: "Rohit Sehgal",
      location: "Mumbai",
      text: "Prescription upload was simple, and the pharmacist even called to confirm dosage.",
    },
    {
      name: "Mahima",
      location: "Bengaluru",
      text: "Great discounts on monthly medicines and very professional packaging.",
    },
  ];

  return (
    <section className="bg-linear-to-b from-sky-50 to-white py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="text-2xl font-bold text-sky-900 sm:text-3xl lg:text-4xl">
            What Our Customers Say 💙
          </h2>

          <p className="mt-2 text-sm text-sky-600 sm:text-base">
            Trusted by thousands across India
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 lg:gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="relative flex h-full flex-col gap-4 rounded-3xl border border-sky-100 bg-white/80 p-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl sm:p-6"
            >
              {/* Quote Icon */}
              <Quote className="absolute right-4 top-4 h-10 w-10 text-sky-100 sm:right-5 sm:top-5 sm:h-12 sm:w-12" />

              {/* Stars */}
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="sm:h-[18px] sm:w-[18px]"
                    fill="#fbbf24"
                    stroke="none"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="flex-1 text-sm leading-relaxed text-sky-800">
                “{t.text}”
              </p>

              {/* User */}
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-sky-200 font-semibold text-sky-700">
                  {t.name.charAt(0)}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-sky-900">
                    {t.name}
                  </p>

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
