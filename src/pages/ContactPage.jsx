import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";

const ContactPage = () => {
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
                className="w-full resize-none min-h-[120px] px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-sky-400 outline-none text-sm"
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
          <div className="bg-white rounded-3xl shadow-md border border-sky-100 p-5 sm:p-6 hover:shadow-lg transition">
            <h2 className="text-lg font-semibold text-sky-900 mb-4 sm:text-xl">
              Pharmacy Address
            </h2>
            <div className="flex items-start gap-2 mb-2">
              <MapPin
                className="text-emerald-600 flex-shrink-0 mt-0.5"
                size={18}
              />
              <p className="break-words">
                Medicity Online Pharmacy, Batala Road, Amritsar, India
              </p>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <Phone className="text-emerald-600 flex-shrink-0" size={18} />
              <p>+91 99882 61955</p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="text-emerald-600 flex-shrink-0" size={18} />
              <p className="break-words">codesnippet17@gmail.com</p>
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
