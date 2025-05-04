import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { eventService } from "../services/eventService";
import { toast } from "react-hot-toast";
import one from "../assets/Events/IEEE-scaled.png";
import two from "../assets/Events/IEEE-scaled (1).png";
import second from "../assets/My Clubs/Rectangle 44.png";

const EventsRight = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const fetchedEvents = await eventService.getAllEvents();
      setEvents(fetchedEvents);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await eventService.registerForEvent(eventId);
      toast.success("Successfully registered for the event!");
      // Refresh events to update registration status
      fetchEvents();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Filter events based on active tab and search query
  const filteredEvents = events
    .filter((event) => {
      if (activeTab === "upcoming") {
        // For upcoming tab, show both upcoming and previous events
        return true;
      } else {
        // For completed tab, only show completed events
        return event.status === "completed";
      }
    })
    .filter(
      (event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      // Sort by date, upcoming events first, then by date
      if (a.status === "upcoming" && b.status !== "upcoming") return -1;
      if (a.status !== "upcoming" && b.status === "upcoming") return 1;
      return new Date(a.date) - new Date(b.date);
    });

  if (loading) {
    return (
      <div className="text-white w-full px-4 sm:px-6 md:px-8 lg:px-10 mx-auto font-[Montserrat] flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-white w-full px-4 sm:px-6 md:px-8 lg:px-10 mx-auto font-[Montserrat] flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-white w-full px-4 sm:px-6 md:px-8 lg:px-10 mx-auto font-[Montserrat]"
    >
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-2xl sm:text-3xl font-bold text-center my-6 sm:my-10 tracking-wide"
      >
        Events
      </motion.h1>
      <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4 sm:gap-0">
        <div className="flex gap-2 sm:gap-4 justify-center sm:justify-start">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className={`px-3 sm:px-4 py-2 rounded-full font-medium text-sm sm:text-base ${
              activeTab === "upcoming"
                ? "bg-white text-black"
                : "bg-gray-500 text-white"
            }`}
            onClick={() => setActiveTab("upcoming")}
          >
            All Events
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className={`px-3 sm:px-4 py-2 rounded-full font-medium text-sm sm:text-base ${
              activeTab === "completed"
                ? "bg-white text-black"
                : "bg-gray-500 text-white"
            }`}
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </motion.button>
        </div>
        <div className="w-full sm:w-auto">
          <input
            type="text"
            name="search"
            placeholder="Search events"
            className="w-full sm:w-[250px] p-2 rounded-md border border-gray-300 text-black focus:outline-none text-sm sm:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className={`relative rounded-3xl w-full p-2 ${
              event.status === "upcoming" ? "bg-[#49478C]" : "bg-gray-700"
            }`}
          >
            <img
              src={`http://localhost:3000${event.image}`}
              alt={event.title}
              className="rounded-t-3xl w-full h-40 sm:h-48 object-cover"
            />
            <div className="relative -top-6 text-center">
              <span className="block w-16 sm:w-20 mx-auto bg-black text-white rounded-full p-2 font-semibold text-xs sm:text-sm">
                {event.label}
              </span>
            </div>
            <div className="text-center mt-2">
              <p className="font-medium text-sm sm:text-base">{event.location}</p>
              <p className="font-semibold text-sm sm:text-base">{event.title}</p>
              <p className="text-black font-medium text-xs sm:text-sm">
                📅 {new Date(event.date).toLocaleDateString()} | {event.type}
              </p>
              {event.status === "completed" && (
                <p className="text-red-400 font-medium mt-1 text-xs sm:text-sm">Event Completed</p>
              )}
            </div>
            <div className="flex justify-center mt-4">
              {event.status === "upcoming" ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-4 sm:px-5 py-1 rounded-full bg-[#D9D9D9] text-black font-medium text-xs sm:text-sm"
                  onClick={() => handleRegister(event._id)}
                >
                  Register
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-4 sm:px-5 py-1 rounded-full bg-gray-400 text-white font-medium text-xs sm:text-sm"
                >
                  View Details
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default EventsRight;
