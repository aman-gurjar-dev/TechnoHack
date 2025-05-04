import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import heroImage from "../assets/hero-image.png";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between px-4 md:px-8 lg:px-20 py-16 md:py-24 lg:py-36">
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center lg:text-left w-full lg:w-1/2"
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
          Revolutionizing{" "}
          <span className="text-blue-400 animate-pulse">Student Clubs</span>{" "}
          <br className="hidden md:block" />
          with Smart{" "}
          <span className="text-blue-400 animate-pulse">Automation</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl lg:text-2xl text-gray-400">
          Seamlessly manage events, credits & resources
        </p>

        <div className="mt-6 flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-blue-500 px-6 font-bold py-3 rounded-lg hover:bg-blue-700 w-full sm:w-auto"
          >
            Get Started
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-pink-500 px-6 font-bold py-3 rounded-lg hover:bg-pink-700 w-full sm:w-auto"
            onClick={() => navigate("/login")}
          >
            Explore Now
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          className="mt-4 px-6 py-3 border font-bold border-blue-400 rounded-lg hover:bg-blue-400 hover:text-gray-900 w-full sm:w-auto"
          onClick={() => navigate("/login")}
        >
          Join The Revolution Now
        </motion.button>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="mt-12 lg:mt-0 w-full lg:w-1/2 flex justify-center lg:justify-end"
      >
        <img
          src={heroImage}
          alt="Tech Illustration"
          className="rounded-lg shadow-lg w-full max-w-md lg:max-w-lg xl:max-w-xl"
        />
      </motion.div>
    </div>
  );
};

export default HeroSection;
