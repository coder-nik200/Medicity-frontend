import Hero from "../pages/Hero";
import FeaturedMedicines from "../pages/FeaturedMedicines";
import Categories from "../pages/Categories";
import Testimonials from "../pages/Testimonials";

const IndexPage = () => {
  return (
    <main className="min-h-screen bg-linear-to-b from-sky-50 via-white to-emerald-50">
      <Hero />

      <div className="space-y-8 sm:space-y-10 lg:space-y-12">
        <Categories />
        <FeaturedMedicines />
        <Testimonials />
      </div>
    </main>
  );
};

export default IndexPage;
