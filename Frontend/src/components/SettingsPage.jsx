import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUser,
  FaLock,
  FaBell,
  FaEnvelope,
  FaTrash,
  FaSignOutAlt,
} from "react-icons/fa";
import { authService } from "../services/authService";
import { toast } from "react-hot-toast";

const SettingsPage = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const user = await authService.getCurrentUser();
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        password: "",
      });
    } catch (error) {
      toast.error("Failed to fetch profile");
      console.error("Profile fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await authService.updateProfile(profileData);
      setProfileData((prev) => ({
        ...prev,
        password: "", // Clear password field after update
      }));
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  // Logout Function
  const handleLogout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const toggleNotification = (type) => {
    setNotifications({ ...notifications, [type]: !notifications[type] });
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
      <motion.div
        className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto p-4 sm:p-6 md:p-8 mt-4 sm:mt-6 md:mt-10 bg-[#1A0B38] rounded-lg shadow-lg relative"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logout Button */}
        <motion.button
          onClick={handleLogout}
          className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-red-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold hover:bg-red-800 flex items-center text-sm sm:text-base"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaSignOutAlt className="mr-1 sm:mr-2" /> Logout
        </motion.button>

        {/* Profile Settings */}
        <div className="mb-4 sm:mb-6 mt-6 sm:mt-10">
          <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">
            Profile
          </h3>
          <form onSubmit={handleProfileUpdate} className="space-y-3 sm:space-y-4">
            {[
              { icon: FaUser, name: "name", placeholder: "Your Name", type: "text", value: profileData.name },
              { icon: FaEnvelope, name: "email", placeholder: "Email Address", type: "email", value: profileData.email },
              { icon: FaLock, name: "password", placeholder: "New Password", type: "password", value: profileData.password },
            ].map((input, index) => (
              <motion.div
                key={index}
                className="flex items-center bg-gray-800 p-2 sm:p-3 rounded-lg"
                whileHover={{ scale: 1.05 }}
              >
                <input.icon className="text-blue-400 mr-2 sm:mr-3 text-lg sm:text-xl" />
                <input
                  type={input.type}
                  name={input.name}
                  value={input.value}
                  onChange={handleProfileChange}
                  placeholder={input.placeholder}
                  className="bg-transparent focus:outline-none w-full text-sm sm:text-base"
                />
              </motion.div>
            ))}
            <motion.button
              type="submit"
              className="w-full bg-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Update Profile
            </motion.button>
          </form>
        </div>

        {/* Notification Preferences */}
        <div className="mb-4 sm:mb-6">
          <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">
            Notifications
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {Object.keys(notifications).map((type) => (
              <motion.div
                key={type}
                className="flex items-center justify-between bg-gray-800 p-2 sm:p-3 rounded-lg"
                whileHover={{ scale: 1.05 }}
              >
                <span className="flex items-center text-sm sm:text-base">
                  <FaBell className="text-blue-400 mr-2 sm:mr-3 text-lg sm:text-xl" />
                  {type.toUpperCase()} Notifications
                </span>
                <motion.button
                  className={`px-3 sm:px-4 py-1 rounded-lg font-bold text-sm sm:text-base ${
                    notifications[type] ? "bg-green-500" : "bg-red-500"
                  }`}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleNotification(type)}
                >
                  {notifications[type] ? "ON" : "OFF"}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Account Actions */}
        <div className="mt-6 sm:mt-8 text-center">
          <motion.button
            className="bg-red-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-red-800 flex items-center mx-auto text-sm sm:text-base"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaTrash className="mr-1 sm:mr-2" /> Delete Account
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SettingsPage;
