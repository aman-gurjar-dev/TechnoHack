import React from "react";
import { motion } from "framer-motion";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const ContactSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="flex flex-col md:flex-row bg-[rgba(16,4,37,1)] text-white min-h-[80vh] max-w-[90rem] m-auto items-center justify-center p-4 sm:p-8 md:p-16 lg:p-44"
    >
      {/* Left Side - Contact Info */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="w-full md:w-1/3 bg-[#1A0B38] p-6 sm:p-8 md:p-10 rounded-lg md:rounded-r-none mb-6 md:mb-0"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Contact <span className="text-blue-400">Us</span>
        </h2>
        <p className="text-gray-400 text-sm sm:text-base">
          We are here to help you
        </p>
        <div className="mt-6 space-y-4 sm:space-y-6">
          <div className="flex items-center space-x-3">
            <FaPhoneAlt className="text-blue-400 text-xl sm:text-2xl" />
            <span className="text-sm sm:text-base">+91 1234567890</span>
          </div>
          <div className="flex items-center space-x-3">
            <FaEnvelope className="text-blue-400 text-xl sm:text-2xl" />
            <span className="text-sm sm:text-base">technoclubs@gmail.com</span>
          </div>
          <div className="flex items-center space-x-3">
            <FaMapMarkerAlt className="text-blue-400 text-xl sm:text-2xl" />
            <span className="text-sm sm:text-base">
              Medicaps University, Indore M.P.
            </span>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Contact Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="w-full md:w-2/3 bg-[#0D021E] p-6 sm:p-8 md:p-10 rounded-lg md:rounded-l-none shadow-lg"
      >
        <h2 className="text-2xl sm:text-3xl font-bold">Let's Talk</h2>
        <p className="text-blue-400 mb-4 sm:mb-6 text-sm sm:text-base">
          Feel free to contact us below
        </p>

        <form className="space-y-3 sm:space-y-4">
          <input
            type="text"
            placeholder="Your Name..."
            className="w-full p-2 sm:p-3 rounded-lg bg-gray-300 text-black text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email Id..."
            className="w-full p-2 sm:p-3 rounded-lg bg-gray-300 text-black text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Message.."
            rows="4"
            className="w-full p-2 sm:p-3 rounded-lg bg-gray-300 text-black text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-blue-500 w-full py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-base hover:bg-blue-700 transition"
          >
            Submit
          </motion.button>
        </form>
      </motion.div>
    </motion.section>
  );
};

export default ContactSection;
