import React, { useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";

const ContactPage = () => {
  const [result, setResult] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();

    setResult("Sending...");

    const formData = new FormData(event.target);
    formData.append("access_key", "af444533-6395-4848-b670-f68541cab35a");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      setResult("✅ Message sent successfully!");
      event.target.reset();
    } else {
      console.log(data);
      setResult("❌ Failed to send message.");
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 py-6 px-4 sm:py-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 sm:gap-8">
        {/* Contact Form */}
        <div className="bg-white rounded-3xl shadow-md border border-sky-100 p-5 sm:p-8">
          <h1 className="text-2xl font-bold text-sky-900 mb-3 sm:text-3xl">
            Contact Us
          </h1>

          <p className="text-sm text-sky-700 mb-6">
            Questions about orders, prescriptions or payments? Our support team
            is available 24/7.
          </p>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-sky-900 mb-1">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                required
                placeholder="Enter your name"
                className="w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-sky-400 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-sky-900 mb-1">
                Email
              </label>

              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-sky-400 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-sky-900 mb-1">
                Message
              </label>

              <textarea
                name="message"
                required
                placeholder="Write your message here..."
                className="w-full resize-none min-h-[120px] px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-sky-400 outline-none text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl text-sm font-semibold shadow-md transition"
            >
              Send Message
            </button>

            {result && (
              <p className="text-center text-sm font-medium text-sky-700">
                {result}
              </p>
            )}
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-md border border-sky-100 p-5 sm:p-6 hover:shadow-lg transition">
            <h2 className="text-lg font-semibold text-sky-900 mb-4 sm:text-xl">
              Pharmacy Address
            </h2>

            <div className="flex items-start gap-2 mb-3">
              <MapPin
                className="text-emerald-600 flex-shrink-0 mt-0.5"
                size={18}
              />
              <p>
                Medicity Online Pharmacy, Batala Road, Amritsar, Punjab, India
              </p>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <Phone className="text-emerald-600" size={18} />
              <p>+91 99882 61955</p>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="text-emerald-600" size={18} />
              <p>codesnippet17@gmail.com</p>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-3xl border border-emerald-100 p-5 hover:bg-emerald-100 transition">
            <h2 className="text-sm font-semibold text-emerald-800 mb-2">
              Emergency Support
            </h2>

            <p className="text-xs text-emerald-800">
              For urgent medicine delivery or order modifications, call our 24/7
              helpline at <span className="font-semibold">+91 9988261955</span>.
              In case of medical emergencies, please contact your nearest
              hospital immediately.
            </p>
          </div>

          {/* Google Map */}
          <div className="rounded-2xl overflow-hidden shadow-md">
            <iframe
              title="Medicity Location"
              src="https://www.google.com/maps?q=Batala+Road+Amritsar&output=embed"
              className="w-full h-60 border-0"
              loading="lazy"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
