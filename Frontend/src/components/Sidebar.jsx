import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/Events/logo.png";
import Effect from "../assets/Ellipse 7.png";
import {
  FaCalendarAlt,
  FaFolder,
  FaCog,
  FaUsers,
  FaHome,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { GiClubs } from "react-icons/gi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 text-white bg-[#00000025] p-2 rounded-md"
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        ></div>
      )}

      <motion.div
        initial={false}
        animate={{
          x: isOpen ? 0 : window.innerWidth < 1024 ? -200 : 0,
          opacity: 1,
        }}
        transition={{ duration: 0.3 }}
        className={`bg-[#00000025] w-[70%] sm:w-[50%] md:w-[40%] lg:w-[20%] min-h-screen text-white flex flex-col items-center p-4 sm:p-6 fixed lg:fixed top-0 left-0 z-40 ${
          isOpen ? "block" : "lg:block hidden"
        }`}
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full flex justify-center py-6 sm:py-8"
        >
          <img src={logo} alt="Logo" className="w-16 sm:w-20" />
        </motion.div>

        {/* Navigation */}
        <ul className="w-full space-y-4 sm:space-y-6 mt-6">
          {[
            {
              to: "/events",
              icon: <FaHome className="text-lg sm:text-xl" />,
              label: "Events",
            },
            {
              to: "/dashboard",
              icon: <MdSpaceDashboard className="text-xl sm:text-2xl" />,
              label: "Dashboard",
            },
            {
              to: "/resources",
              icon: <FaFolder className="text-lg sm:text-xl" />,
              label: "Resources",
            },
            {
              to: "/members",
              icon: <FaUsers className="text-xl sm:text-2xl" />,
              label: "Members",
            },
            {
              to: "/clubs",
              icon: <GiClubs className="text-xl sm:text-2xl" />,
              label: "My Clubs",
            },
          ].map((item, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="w-full"
            >
              <NavLink
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 w-full transition-all duration-300 rounded-md ${
                    isActive
                      ? "bg-[#838383] text-black"
                      : "hover:bg-[#838383] hover:text-black"
                  }`
                }
              >
                {item.icon}
                <span className="text-sm sm:text-base">{item.label}</span>
              </NavLink>
            </motion.li>
          ))}
        </ul>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full mt-auto pt-6"
        >
          <NavLink
            to="/settings"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 w-full transition-all duration-300 rounded-md ${
                isActive
                  ? "bg-[#838383] text-black"
                  : "hover:bg-[#838383] hover:text-black"
              }`
            }
          >
            <FaCog className="text-xl sm:text-2xl" />
            <span className="text-sm sm:text-base">Settings</span>
          </NavLink>
        </motion.div>

        {/* Background Effect */}
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1 }}
          src={Effect}
          alt="Effect"
          className="absolute bottom-0 left-0 w-full -z-10"
        />
      </motion.div>
    </>
  );
};

export default Sidebar;
