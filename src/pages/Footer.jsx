import React from "react";
import { Link } from "react-router-dom";
import {
  Instagram,
  Twitter,
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-12 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <h2 className="mb-4 text-xl font-bold">💊 Medicity</h2>
          <p className="text-sm leading-relaxed text-slate-300">
            Your trusted online pharmacy. Delivering genuine medicines and
            healthcare products at your doorstep.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Quick Links</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>
              <Link to="/" className="transition hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="transition hover:text-white">
                Medicines
              </Link>
            </li>
            <li>
              <Link to="/categories" className="transition hover:text-white">
                Categories
              </Link>
            </li>
            <li>
              <Link to="/about" className="transition hover:text-white">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Customer Support</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>
              <Link to="/contact" className="transition hover:text-white">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/about" className="transition hover:text-white">
                FAQs
              </Link>
            </li>
            <li>
              <Link to="/about" className="transition hover:text-white">
                Returns Policy
              </Link>
            </li>
            <li>
              <Link to="/about" className="transition hover:text-white">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Contact</h3>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <MapPin size={18} className="text-sky-400" />

              <span>Amritsar, Punjab, India</span>
            </div>

            <a
              href="tel:+919988261955"
              className="flex items-center gap-3 text-sm text-slate-300 transition hover:text-sky-400"
            >
              <Phone size={18} className="text-sky-400" />

              <span>+91 99882 61955</span>
            </a>

            <a
              href="mailto:codesnippet17@gmail.com"
              className="flex items-center gap-3 text-sm text-slate-300 transition hover:text-sky-400"
            >
              <Mail size={18} className="text-sky-400" />

              <span>codesnippet17@gmail.com</span>
            </a>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="https://github.com/coder-nik200"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="transition hover:text-sky-400"
            >
              <Github size={18} />
            </a>
            <a
              href="https://www.instagram.com/wohh.nitish"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="transition hover:text-pink-400"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://www.linkedin.com/in/nitish-kumar-bharti-631a37359"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="transition hover:text-blue-400"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="https://x.com/code_Bharti07"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="transition hover:text-slate-200"
            >
              <Twitter size={18} />
            </a>
            <a
              href="mailto:codesnippet17@gmail.com"
              aria-label="Email"
              className="text-sm font-medium transition hover:text-red-400"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} Medicity. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
