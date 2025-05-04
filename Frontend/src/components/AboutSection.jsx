import React from "react";
import { motion } from "framer-motion";
import about from "../assets/about.png";

const AboutSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
      className="m-auto px-4 sm:px-6 md:px-20 py-12 md:py-16 bg-[rgba(16,4,37,1)]"
    >
      <div className="mt-20 md:mt-40 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 lg:gap-32">
        <div className="w-full max-w-3xl text-center md:text-left px-4 md:px-0">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12 md:ml-8 lg:ml-32">
            About <span className="text-blue-500">Us</span>
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl max-w-full md:max-w-[30rem]">
            Welcome to{" "}
            <span className="text-blue-500 font-semibold">
              Techno Clubs Portal
            </span>
            , the ultimate platform for managing student organizations
            seamlessly.
          </p>
          <p className="text-lg md:text-xl lg:text-2xl mt-4 max-w-full md:max-w-[30rem]">
            Our mission is to revolutionize the way student clubs operate by
            integrating
            <span className="text-blue-500 font-semibold">
              {" "}
              AI-driven credit systems
            </span>
            and streamlined event management into one unified solution.
          </p>
        </div>
        <motion.div
          className="w-full md:w-auto flex justify-center"
          whileHover={{ scale: 1.05 }}
        >
          <img
            src={about}
            alt="About Us"
            className="w-full max-w-[18rem] sm:max-w-[22rem] md:max-w-[28rem] rounded-lg shadow-lg"
          />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AboutSection;
