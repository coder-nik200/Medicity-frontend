import React from "react";
import { useNavigate } from "react-router-dom";
import { Pill, HeartPulse, Stethoscope, Syringe } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Pain Relief",
    slug: "Pain Relief",
    description:
      "Tablets, sprays and gels to relieve headaches, body pain and more.",
    icon: Pill,
    color: "from-sky-100 to-emerald-50",
  },
  {
    id: 2,
    name: "Diabetes Care",
    slug: "Diabetes Care",
    description:
      "Trusted medicines and monitoring devices for diabetes management.",
    icon: Syringe,
    color: "from-emerald-100 to-sky-50",
  },
  {
    id: 3,
    name: "Cold & Flu",
    slug: "Cold & Flu",
    description:
      "Cardiac care medicines and supplements prescribed by cardiologists.",
    icon: HeartPulse,
    color: "from-sky-100 to-sky-50",
  },
  {
    id: 4,
    name: "Vitamins & Minerals",
    slug: "Vitamins & Minerals",
    description:
      "Multivitamins, minerals and immunity boosters for all age groups.",
    icon: Stethoscope,
    color: "from-emerald-100 to-emerald-50",
  },
];

const CategoriesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-sky-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-sky-900 mb-2">Categories</h1>
        <p className="text-sky-700 mb-8">
          Explore our curated medical categories for faster, safer shopping.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => navigate(`/category/${encodeURIComponent(cat.slug)}`)}
                className="cursor-pointer bg-white rounded-2xl border border-sky-100 
                shadow-sm hover:shadow-md hover:-translate-y-1 
                transition-all overflow-hidden"
              >
                {/* Header */}
                <div
                  className={`h-24 bg-gradient-to-r ${cat.color} flex items-center px-5`}
                >
                  <div className="w-12 h-12 rounded-full bg-white/70 flex items-center justify-center shadow-sm mr-4">
                    <Icon className="text-sky-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-sky-900">
                      {cat.name}
                    </h2>
                    <p className="text-xs uppercase tracking-wide text-emerald-700">
                      Medicity Speciality
                    </p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                  <p className="text-sm text-sky-800 mb-4">
                    {cat.description}
                  </p>
                  <span className="text-sm font-semibold text-sky-700 underline underline-offset-4">
                    View medicines →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
