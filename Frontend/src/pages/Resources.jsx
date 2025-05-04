import React from "react";
import { motion } from "framer-motion";
import { FaBook, FaChalkboardTeacher, FaUsers } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const resources = [
  {
    name: "Technical Handbook",
    type: "PDF",
    category: "Documentation",
    link: "#",
  },
  { name: "Workshop Toolkit", type: "Video", category: "Training", link: "#" },
  { name: "Project Templates", type: "ZIP", category: "Templates", link: "#" },
];

const meetingRooms = [
  { name: "Conference Room A", capacity: 10, availability: "Available" },
  { name: "Seminar Hall 1", capacity: 50, availability: "Booked" },
  { name: "Discussion Room B", capacity: 8, availability: "Available" },
  { name: "Lecture Hall C", capacity: 100, availability: "Available" },
];

const ResourcesPage = () => {
  return (
    <div className="bg-[#0D021E] text-white min-h-screen">
      <main className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
          Resources & <span className="text-blue-600">Meeting Rooms</span>
        </h1>
        <p className="text-center text-gray-400 mb-6 text-sm sm:text-base">
          Find documents, tools, and available spaces.
        </p>

        {/* Digital Resources Section */}
        <section className="mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            Digital Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {resources.map((resource, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-[#31215C] p-4 sm:p-6 rounded-lg shadow-lg"
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <FaBook className="text-blue-400 text-xl sm:text-2xl" />
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold">
                      {resource.name}
                    </h3>
                    <p className="text-gray-300 text-sm sm:text-base">
                      {resource.category} ({resource.type})
                    </p>
                    <a
                      href={resource.link}
                      className="text-blue-400 underline text-sm sm:text-base"
                    >
                      Access
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Meeting Rooms Section */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            Available Meeting Rooms
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {meetingRooms.map((room, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className={`p-4 sm:p-6 rounded-lg shadow-lg ${
                  room.availability === "Available"
                    ? "bg-green-700"
                    : "bg-red-700"
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold">
                      {room.name}
                    </h3>
                    <p className="text-gray-300 text-sm sm:text-base">
                      Capacity: {room.capacity} people
                    </p>
                    <p className="font-bold text-sm sm:text-base">
                      Status: {room.availability}
                    </p>
                  </div>
                  {room.availability === "Available" && (
                    <button className="bg-blue-500 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-white hover:bg-blue-600 text-sm sm:text-base w-full sm:w-auto">
                      Book Now
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ResourcesPage;
