import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-sky-50 py-10 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="bg-white rounded-3xl shadow-md border border-sky-100 p-8">
          <h1 className="text-3xl font-bold text-sky-900 mb-3">Contact Us</h1>
          <p className="text-sm text-sky-700 mb-6">
            Questions about orders, prescriptions or payments? Our support team
            is available 24/7.
          </p>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-sky-900 mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-sky-400 outline-none text-sm"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sky-900 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-sky-400 outline-none text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sky-900 mb-1">
                Message
              </label>
              <textarea
                className="w-full min-h-[120px] px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-sky-400 outline-none text-sm"
                placeholder="Write your message here..."
              />
            </div>
            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl text-sm font-semibold shadow-md transition">
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-md border border-sky-100 p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-sky-900 mb-4">
              Pharmacy Address
            </h2>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="text-emerald-600" size={18} />
              <p>Medicity Online Pharmacy, Connaught Place, Amritsar, India</p>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <Phone className="text-emerald-600" size={18} />
              <p>+91 98765 43210</p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="text-emerald-600" size={18} />
              <p>support@medicity.health</p>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-3xl border border-emerald-100 p-5 hover:bg-emerald-100 transition">
            <h2 className="text-sm font-semibold text-emerald-800 mb-2">
              Emergency Support
            </h2>
            <p className="text-xs text-emerald-800">
              For urgent medicine delivery or order modifications, call our 24/7
              helpline at{" "}
              <span className="font-semibold">+91 8000 123 123</span>. In case
              of medical emergencies, please contact your nearest hospital
              immediately.
            </p>
          </div>

          {/* Optional: Map Placeholder */}
          <div className="bg-sky-100 h-40 rounded-2xl flex items-center justify-center text-sky-700 text-sm">
            Map Placeholder
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
