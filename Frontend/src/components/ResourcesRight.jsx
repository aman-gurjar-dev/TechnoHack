import React, { useState } from "react";
import {
  FaSearch,
  FaDownload,
  FaEye,
  FaLayerGroup,
  FaCog,
  FaBook,
  FaCode,
} from "react-icons/fa";
import Logo from "../assets/logo.png";
import { motion } from "framer-motion";

const resources = [
  { id: 1, title: "React Basics Guide", category: "Coding", link: "#" },
  { id: 2, title: "UI/UX Design Principles", category: "Design", link: "#" },
  { id: 3, title: "Event Management Handbook", category: "Event", link: "#" },
  {
    id: 4,
    title: "Club Constitution Template",
    category: "Documents",
    link: "#",
  },
  { id: 5, title: "Git & GitHub Guide", category: "Coding", link: "#" },
];

const categories = ["All", "Coding", "Design", "Event", "Documents"];

const ResourcesRight = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredResources = resources.filter(
    (res) =>
      (selectedCategory === "All" || res.category === selectedCategory) &&
      res.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex bg-[#0D021E] text-white min-h-screen p-4 sm:p-6 md:p-8"
    >
      {/* Main Content */}
      <motion.main
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
          Resources & Learning Materials
        </h1>
        <p className="text-center text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">
          Find the best materials for your club activities.
        </p>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4"
        >
          <input
            type="text"
            placeholder="🔍 Search Resources..."
            className="w-full sm:w-72 md:w-96 h-10 p-3 rounded-lg bg-gray-800 text-white focus:outline-none text-sm sm:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold text-sm sm:text-base transition ${
                  selectedCategory === cat
                    ? "bg-blue-500"
                    : "bg-gray-700 hover:bg-blue-600"
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Resource Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {filteredResources.map((resource) => (
            <motion.div
              key={resource.id}
              className="bg-[#31215C] p-4 sm:p-6 rounded-lg shadow-lg flex flex-col items-center gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <h3 className="text-lg sm:text-xl font-semibold text-center">
                {resource.title}
              </h3>
              <p className="text-gray-400 text-center text-sm sm:text-base">
                {resource.category}
              </p>
              <div className="flex gap-2 sm:gap-3">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  href={resource.link}
                  className="bg-blue-500 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-white hover:bg-blue-700 flex items-center gap-2 text-sm sm:text-base"
                >
                  <FaEye className="text-sm sm:text-base" /> View
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  href={resource.link}
                  className="bg-green-500 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-white hover:bg-green-700 flex items-center gap-2 text-sm sm:text-base"
                >
                  <FaDownload className="text-sm sm:text-base" /> Download
                </motion.a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.main>
    </motion.div>
  );
};

export default ResourcesRight;
