import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Twitter, Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
          <h2 className="text-xl font-bold mb-4">💊 Medicity</h2>
          <p className="text-sm text-blue-200">
            Your trusted online pharmacy. Delivering genuine medicines and
            healthcare products at your doorstep.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-blue-300">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-blue-300">
                Medicines
              </Link>
            </li>
            <li>
              <Link to="/categories" className="hover:text-blue-300">
                Categories
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-blue-300">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h3 className="font-semibold mb-4">Customer Support</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/contact" className="hover:text-blue-300">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-blue-300">
                FAQs
              </Link>
            </li>
            <li>
              <Link to="/returns" className="hover:text-blue-300">
                Returns Policy
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-blue-300">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold mb-4">Contact</h3>
          <p className="text-sm text-blue-200">📍 Amritsar, India</p>
          <p className="text-sm text-blue-200">📞 +91 99882 61955</p>
          <p className="text-sm text-blue-200">✉ codesnippet17@gmail.com</p>

          <div className="flex gap-4 mt-4">
            <a
              href="https://github.com/coder-nik200"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:text-blue-300 transition-colors"
            >
              <Github size={20} />
            </a>

            <a
              href="https://www.instagram.com/wohh.nitish"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-pink-400 transition-colors"
            >
              <Instagram size={20} />
            </a>

            <a
              href="https://www.linkedin.com/in/nitish-kumar-bharti-631a37359"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-blue-400 transition-colors"
            >
              <Linkedin size={20} />
            </a>

            <a
              href="https://x.com/code_Bharti07"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="hover:text-gray-300 transition-colors"
            >
              <Twitter size={20} />
            </a>

            <a
              href="mailto:codesnippet17@gmail.com"
              aria-label="Email"
              className="hover:text-red-400 transition-colors text-sm font-medium"
            >
              ✉
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-blue-800 text-center py-4 text-sm text-blue-300">
        © {new Date().getFullYear()} Medicity. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
