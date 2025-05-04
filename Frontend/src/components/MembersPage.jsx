import React from "react";
import { motion } from "framer-motion";
import img1 from "../assets/img1.png";
import Logo from "../assets/logo.png";

const members = [
  {
    name: "Shreyas Tiwari",
    role: "President",
    badge: "Active",
    events: 20,
    projects: 10,
    memberSince: 2021,
  },
  {
    name: "Shivansh Khandelwal",
    role: "Vice President",
    badge: "Contributor",
    events: 15,
    projects: 8,
    memberSince: 2022,
  },
  {
    name: "Prince Pandey",
    role: "Lead Developer",
    badge: "Active",
    events: 12,
    projects: 15,
    memberSince: 2021,
  },
  {
    name: "Aman Gurjar",
    role: "Event Coordinator",
    badge: "New Member",
    events: 3,
    projects: 2,
    memberSince: 2024,
  },
  {
    name: "Aanya Rao",
    role: "Club Member",
    badge: "Inactive",
    events: 5,
    projects: 1,
    memberSince: 2023,
  },
];

const MembersPage = () => {
  return (
    <div className="flex bg-[#0D021E] text-white min-h-screen w-full overflow-y-auto">
      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full p-4 sm:p-6 md:p-8 lg:p-10 mx-auto"
      >
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center"
        >
          Meet Our <span className="text-blue-600">Members</span>
        </motion.h1>
        <p className="text-center text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
          Explore the brilliant minds behind this club!
        </p>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mb-4 sm:mb-6"
          >
            <input
              type="text"
              placeholder="🔍 Search ..."
              className="w-full sm:w-96 h-10 p-3 rounded-lg bg-gray-800 text-white focus:outline-none"
            />
          </motion.div>

          {members.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#31215C] border-white rounded-lg p-3 sm:p-5 mb-4 flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 shadow-lg"
            >
              <img
                src={img1}
                alt={member.name}
                className="rounded-full w-16 h-16 sm:w-20 sm:h-20 border-2 border-white"
              />
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-semibold">
                  {member.name} – {member.role}
                </h3>
                <p className="text-gray-300 text-sm sm:text-base">
                  ⚡ Activity Badge: {member.badge}
                </p>
                <p className="text-gray-300 text-sm sm:text-base">
                  📅 {member.events}+ Events Attended
                </p>
                <p className="text-gray-300 text-sm sm:text-base">
                  🛠 {member.projects} Projects Contributed
                </p>
                <p className="text-gray-300 text-sm sm:text-base">
                  👥 Member Since {member.memberSince}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-blue-500 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-white hover:bg-blue-600 transition text-sm sm:text-base w-full sm:w-auto"
              >
                View Profile
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.main>
    </div>
  );
};

export default MembersPage;