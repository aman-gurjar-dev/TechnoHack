import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { clubService } from "../services/clubService";
import { authService } from "../services/authService";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaUsers,
  FaCalendarAlt,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";

const ClubsPage = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Technical",
    image: null,
  });

  useEffect(() => {
    fetchClubs();
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const user = await authService.getCurrentUser();
      setIsAdmin(user.role === "admin");
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const fetchedClubs = await clubService.getAllClubs();
      setClubs(fetchedClubs);
    } catch (error) {
      toast.error("Failed to fetch clubs");
      console.error("Clubs fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        image: e.target.files[0],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (selectedClub) {
        await clubService.updateClub(selectedClub._id, formDataToSend);
        toast.success("Club updated successfully!");
      } else {
        await clubService.createClub(formDataToSend);
        toast.success("Club created successfully!");
      }

      setShowForm(false);
      setSelectedClub(null);
      setFormData({
        name: "",
        description: "",
        category: "Technical",
        image: null,
      });
      fetchClubs();
    } catch (error) {
      toast.error(error.message || "Failed to save club");
    }
  };

  const handleEdit = (club) => {
    setSelectedClub(club);
    setFormData({
      name: club.name,
      description: club.description,
      category: club.category,
      image: null,
    });
    setShowForm(true);
  };

  const handleDelete = async (clubId) => {
    if (window.confirm("Are you sure you want to delete this club?")) {
      try {
        await clubService.deleteClub(clubId);
        toast.success("Club deleted successfully!");
        fetchClubs();
      } catch (error) {
        toast.error(error.message || "Failed to delete club");
      }
    }
  };

  const handleJoin = async (clubId) => {
    try {
      await clubService.joinClub(clubId);
      toast.success("Successfully joined the club!");
      fetchClubs();
    } catch (error) {
      toast.error(error.message || "Failed to join club");
    }
  };

  const handleLeave = async (clubId) => {
    try {
      await clubService.leaveClub(clubId);
      toast.success("Successfully left the club!");
      fetchClubs();
    } catch (error) {
      toast.error(error.message || "Failed to leave club");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-[#0D021E] text-white min-h-screen overflow-y-auto w-full flex justify-center"
    >
      <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto p-4 sm:p-6 md:p-8 mt-4 sm:mt-6 md:mt-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Clubs</h1>
          {isAdmin && (
            <motion.button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-700 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus className="mr-2" /> Create Club
            </motion.button>
          )}
        </div>

        {/* Create/Edit Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1A0B38] p-6 rounded-lg mb-6"
          >
            <h2 className="text-xl font-semibold mb-4">
              {selectedClub ? "Edit Club" : "Create New Club"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Technical">Technical</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                  <option value="Academic">Academic</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full bg-gray-800 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <motion.button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedClub(null);
                    setFormData({
                      name: "",
                      description: "",
                      category: "Technical",
                      image: null,
                    });
                  }}
                  className="bg-gray-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  className="bg-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {selectedClub ? "Update" : "Create"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <motion.div
              key={club._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1A0B38] rounded-lg overflow-hidden shadow-lg"
            >
              <div className="relative h-48">
                <img
                  src={club.image || "https://via.placeholder.com/400x200"}
                  alt={club.name}
                  className="w-full h-full object-cover"
                />
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <motion.button
                      onClick={() => handleEdit(club)}
                      className="bg-blue-600 p-2 rounded-full hover:bg-blue-700"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaEdit />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(club._id)}
                      className="bg-red-600 p-2 rounded-full hover:bg-red-700"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaTrash />
                    </motion.button>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{club.name}</h3>
                <p className="text-gray-400 mb-4">{club.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">
                    {club.category}
                  </span>
                  <div className="flex items-center text-gray-400">
                    <FaUsers className="mr-1" />
                    <span>{club.members.length} members</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-400">
                    <FaCalendarAlt className="mr-1" />
                    <span>{club.events.length} events</span>
                  </div>
                  {club.members.some(
                    (member) => member.user._id === authService.getCurrentUser()?._id
                  ) ? (
                    <motion.button
                      onClick={() => handleLeave(club._id)}
                      className="bg-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-700 flex items-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaSignOutAlt className="mr-2" /> Leave
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={() => handleJoin(club._id)}
                      className="bg-green-600 px-4 py-2 rounded-lg font-bold hover:bg-green-700 flex items-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaSignInAlt className="mr-2" /> Join
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ClubsPage; 