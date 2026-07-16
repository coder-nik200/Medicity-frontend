import Hero from "../pages/Hero";
import FeaturedMedicines from "../pages/FeaturedMedicines";
import Categories from "../pages/Categories";
import Testimonials from "../pages/Testimonials";

const IndexPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50">
      {/* Hero */}
      <Hero />
      
      {/* Categories strip */}
      <Categories />

      {/* Featured medicines */}
      <FeaturedMedicines />

      {/* Testimonials */}
      <Testimonials />
    </div>
  );
};

export default IndexPage;
