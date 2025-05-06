import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { eventService } from "../services/eventService";
import { FaUsers, FaUser, FaEnvelope } from "react-icons/fa";

const EventRegistrations = ({ eventId }) => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRegistrations();
  }, [eventId]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const data = await eventService.getEventRegistrations(eventId);
      setRegistrations(data.registrations);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to fetch registrations");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <FaUsers className="mr-2" />
          Registered Users
        </h2>
        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
          Total: {registrations.length}
        </span>
      </div>

      {registrations.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No registrations yet</p>
      ) : (
        <div className="space-y-4">
          {registrations.map((user) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <FaUser className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">{user.name}</h3>
                  <div className="flex items-center text-gray-500 text-sm">
                    <FaEnvelope className="mr-1" />
                    {user.email}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default EventRegistrations; 