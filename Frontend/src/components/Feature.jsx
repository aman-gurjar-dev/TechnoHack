import React from "react";
import { motion } from "framer-motion";
import {
  FaRocket,
  FaUserShield,
  FaCalendarAlt,
  FaChartLine,
  FaUsers,
  FaCogs,
} from "react-icons/fa";

const features = [
  {
    icon: <FaRocket />,
    title: "Smart Automation",
    description:
      "Automate club events, attendance, and workflows effortlessly.",
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
  {
    icon: <FaUsers />,
    title: "Collaboration Hub",
    description:
      "Connect, discuss, and collaborate with club members seamlessly.",
  },
  {
    icon: <FaCogs />,
    title: "Custom Integrations",
    description:
      "Easily integrate third-party tools and services for better efficiency.",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="py-36 px-6 md:px-20 bg-[rgba(16,4,37,1)] text-white"
    >
      <motion.h2
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1 }}
        className="text-5xl font-bold text-center mb-12"
      >
        Our <span className="text-blue-500">Features</span>
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="bg-[#1A0B38] p-8 rounded-xl text-center shadow-lg hover:shadow-2xl transition-transform hover:scale-105"
          >
            <div className="text-5xl text-blue-400 mb-4 flex justify-center">
              {feature.icon}
            </div>
            <h3 className="text-2xl font-semibold">{feature.title}</h3>
            <p className="text-gray-400 mt-3">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;
