import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Categories = () => {
  const categories = [
    {
      name: "Pain Relief",
      color: "bg-sky-50",
      hover: "hover:bg-sky-100",
      icon: "💊",
    },
    {
      name: "Diabetes Care",
      color: "bg-emerald-50",
      hover: "hover:bg-emerald-100",
      icon: "🩸",
    },
    {
      name: "Cold & Flu",
      color: "bg-rose-50",
      hover: "hover:bg-rose-100",
      icon: "❤️",
    },
    {
      name: "Vitamins & Minerals",
      color: "bg-yellow-50",
      hover: "hover:bg-yellow-100",
      icon: "🍊",
    },
  ];

  return (
    <section className="bg-linear-to-b from-white to-sky-50 py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-sky-900 sm:text-3xl">
              Shop by Category
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Find medicines by your health needs
            </p>
          </div>

          <Link
            to="/categories"
            className="text-sm font-semibold text-sky-700 transition hover:text-sky-900"
          >
            View all →
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/category/${encodeURIComponent(cat.name)}`}
              className={`group flex flex-col justify-between rounded-3xl border border-slate-100 p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg ${cat.color} ${cat.hover}`}
            >
              <div className="mb-5 text-4xl transition-transform duration-300 group-hover:scale-110">
                {cat.icon}
              </div>

              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold leading-5 text-slate-900">
                  {cat.name}
                </h3>

                <ArrowRight
                  size={18}
                  className="flex-shrink-0 text-sky-600 transition-transform duration-300 group-hover:translate-x-1"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
