import React from "react";
import { motion } from "framer-motion";
import one from "../assets/My Clubs/IEEE-scaled (2).png";
import second from "../assets/My Clubs/Rectangle 44.png";
  
const MyClubsRight = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full px-4 sm:px-6 lg:px-8 text-white"
    >
      <h1 className="text-xl sm:text-2xl font-extrabold text-center my-6 sm:my-10 mb-12 sm:mb-20">
        My Clubs
      </h1>
      <div className="flex justify-end mb-4 sm:mb-6">
        <motion.input
          type="text"
          name="filter"
          placeholder="Filter by category"
          className="w-full sm:w-[25%] p-2 rounded-md border border-gray-300 text-black"
          aria-label="Filter clubs by category"
          whileFocus={{ scale: 1.05 }}
        />
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
        {[
          {
            img: one,
            alt: "IEEE Club",
            name: "IEEE",
            description:
              "Innovate, collaborate, and explore the latest in engineering and technology",
            members: "Total Members: XX",
          },
          {
            img: second,
            alt: "MIII Club",
            name: "MIII",
            description:
              "An Initiative by Medicaps University Empower and Support Emerging Venture.",
            members: "Total Members: XX",
          },
        ].map((club, index) => (
          <motion.div
            key={index}
            className="relative bg-[#49478C] rounded-3xl w-full sm:w-[45%] lg:w-[30%] p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={club.img}
              alt={club.alt}
              className="rounded-t-3xl w-full h-48 sm:h-56 object-cover"
            />
            <div className="relative -top-6 text-center">
              <span className="block w-20 mx-auto bg-black text-white rounded-full p-2 font-bold">
                {club.name}
              </span>
            </div>
            <div className="text-center mt-2 space-y-2">
              <p className="text-sm sm:text-base">Offline | Free</p>
              <p className="text-sm sm:text-base">{club.description}</p>
              <p className="text-white text-sm sm:text-base">{club.members}</p>
            </div>
            <div className="flex justify-center mt-4">
              <motion.button
                className="px-4 sm:px-5 py-1 rounded-full bg-[#D9D9D9] text-black text-sm sm:text-base"
                whileHover={{ scale: 1.1 }}
              >
                View Club
              </motion.button>
            </div>
          </motion.div>
        ))}

        <motion.div
          className="flex flex-col items-center justify-center w-full sm:w-[45%] lg:w-[20%] mt-4 sm:mt-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
        >
          <p className="w-16 h-16 bg-[#476B8C] text-center p-2.5 rounded-full text-4xl font-bold text-white flex items-center justify-center">
            +
          </p>
          <p className="mt-2 font-bold text-lg sm:text-xl">More</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MyClubsRight;