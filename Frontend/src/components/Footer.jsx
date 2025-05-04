import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-[#0D021E] text-gray-300 py-8 sm:py-12 mt-8 sm:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 text-center sm:text-left">
        {/* Left - About Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center sm:items-start"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Techno Clubs Portal
          </h2>
          <p className="mt-2 text-gray-400 text-xs sm:text-sm max-w-xs">
            Revolutionizing student clubs with smart automation and AI-driven
            management.
          </p>
        </motion.div>

        {/* Center - Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center sm:items-start"
        >
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">
            Quick Links
          </h3>
          <div className="flex flex-col space-y-1 sm:space-y-2 text-xs sm:text-sm">
            <a href="/" className="hover:text-blue-400 transition">
              🏠 Home
            </a>
            <a href="/about" className="hover:text-blue-400 transition">
              ℹ️ About
            </a>
            <a href="/resources" className="hover:text-blue-400 transition">
              📚 Resources
            </a>
            <a href="/contact" className="hover:text-blue-400 transition">
              📩 Contact
            </a>
          </div>
        </motion.div>

        {/* Right - Social Media */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center sm:items-start md:items-end"
        >
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">
            Follow Us
          </h3>
          <div className="flex space-x-4">
            <motion.a
              href="#"
              className="text-gray-400 hover:text-blue-400 transition"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaFacebook size={20} />
            </motion.a>
            <motion.a
              href="#"
              className="text-gray-400 hover:text-blue-400 transition"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaTwitter size={20} />
            </motion.a>
            <motion.a
              href="#"
              className="text-gray-400 hover:text-blue-400 transition"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaInstagram size={20} />
            </motion.a>
            <motion.a
              href="#"
              className="text-gray-400 hover:text-blue-400 transition"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaLinkedin size={20} />
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Bottom Divider */}
      <div className="border-t border-gray-600 mt-6 sm:mt-8 mx-auto w-11/12 sm:w-5/6"></div>

      {/* Copyright Section */}
      <div className="text-center text-gray-500 text-xs sm:text-sm mt-4 sm:mt-6">
        © {new Date().getFullYear()} Techno Clubs Portal. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
