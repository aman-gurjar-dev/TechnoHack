import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { clubService } from "../services/clubService";
import { FaUsers, FaCalendarAlt, FaBookOpen } from "react-icons/fa";

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const fetchedClubs = await clubService.getAllClubs();
      setClubs(fetchedClubs);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to fetch clubs");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClub = async (clubId) => {
    try {
      await clubService.joinClub(clubId);
      toast.success("Successfully joined the club!");
      fetchClubs(); // Refresh the clubs list
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleLeaveClub = async (clubId) => {
    try {
      await clubService.leaveClub(clubId);
      toast.success("Successfully left the club!");
      fetchClubs(); // Refresh the clubs list
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredClubs = selectedCategory === "all"
    ? clubs
    : clubs.filter(club => club.category === selectedCategory);

  if (loading) {
    return (
      <div className="text-white w-[70%] mx-auto font-[Montserrat] flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-white w-[70%] mx-auto font-[Montserrat] flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#100425] min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-bold text-white mb-8"
        >
          Explore Clubs
        </motion.h1>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedCategory("Technical")}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === "Technical"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Technical
            </button>
            <button
              onClick={() => setSelectedCategory("Cultural")}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === "Cultural"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Cultural
            </button>
            <button
              onClick={() => setSelectedCategory("Sports")}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === "Sports"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Sports
            </button>
            <button
              onClick={() => setSelectedCategory("Academic")}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === "Academic"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Academic
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club) => (
            <motion.div
              key={club._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={club.image}
                alt={club.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {club.name}
                </h2>
                <p className="text-gray-600 mb-4">{club.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                    {club.category}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {club.members?.length || 0} Members
                  </span>
                </div>
                <button
                  onClick={() =>
                    club.isMember
                      ? handleLeaveClub(club._id)
                      : handleJoinClub(club._id)
                  }
                  className={`w-full py-2 px-4 rounded-md ${
                    club.isMember
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  } text-white transition-colors`}
                >
                  {club.isMember ? "Leave Club" : "Join Club"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Clubs; 