import React from "react";
import { motion } from "framer-motion";
import {
  FaRocket,
  FaUserShield,
  FaCalendarAlt,
  FaChartLine,
} from "react-icons/fa";

const features = [
  {
    icon: <FaRocket />,
    title: "Smart Automation",
    description: "Automate club events, attendance, and workflows seamlessly.",
  },
  {
    icon: <FaUserShield />,
    title: "Secure Access",
    description:
      "Role-based access control ensures only authorized users can manage club activities.",
  },
  {
    icon: <FaCalendarAlt />,
    title: "Event Management",
    description: "Plan, schedule, and track club events with ease.",
  },
  {
    icon: <FaChartLine />,
    title: "Credit System",
    description:
      "AI-driven credits for club participation and performance tracking.",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="py-16 sm:py-24 md:py-36 px-4 sm:px-6 md:px-20 bg-[rgba(16,4,37,1)] text-white"
    >
      <motion.h2
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12"
      >
        Our <span className="text-blue-500">Features</span>
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="bg-[#1A0B38] p-4 sm:p-6 rounded-xl text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105"
          >
            <div className="text-3xl sm:text-4xl md:text-5xl text-blue-400 mb-3 sm:mb-4 flex justify-center">
              {feature.icon}
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">
              {feature.title}
            </h3>
            <p className="text-sm sm:text-base text-gray-400">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;
