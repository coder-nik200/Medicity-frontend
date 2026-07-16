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
    <section className="bg-gradient-to-b from-white to-sky-50 py-14">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-sky-900">
              Shop by Category
            </h2>
            <p className="text-sky-600 text-sm mt-1">
              Find medicines by your health needs
            </p>
          </div>

          <Link
            to="/categories"
            className="text-sm font-semibold text-sky-700 hover:text-sky-900 transition"
          >
            View all →
          </Link>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/category/${encodeURIComponent(cat.name)}`}
              className={`group rounded-3xl ${cat.color} ${cat.hover}
                p-6 shadow-sm hover:shadow-lg hover:-translate-y-2
                transition-all duration-300 flex flex-col justify-between`}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition">
                {cat.icon}
              </div>

              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-sky-900">
                  {cat.name}
                </h3>
                <ArrowRight
                  size={18}
                  className="text-sky-600 group-hover:translate-x-1 transition"
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
