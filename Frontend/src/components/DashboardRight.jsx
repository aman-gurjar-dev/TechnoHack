import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { clubService } from "../services/clubService";
import { authService } from "../services/authService";
import { eventService } from "../services/eventService";
import { announcementService } from "../services/announcementService";
import { FaUsers, FaCalendarAlt, FaBookOpen, FaMapMarkerAlt, FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";

const DashboardRight = () => {
  const [joinedClubs, setJoinedClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upcomingEvent, setUpcomingEvent] = useState(null);
  const [eventLoading, setEventLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [announcementLoading, setAnnouncementLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);

  useEffect(() => {
    fetchJoinedClubs();
    fetchUpcomingEvent();
    fetchAnnouncements();
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

  const fetchAnnouncements = async () => {
    try {
      setAnnouncementLoading(true);
      const fetchedAnnouncements = await announcementService.getAllAnnouncements();
      setAnnouncements(fetchedAnnouncements);
    } catch (error) {
      toast.error("Failed to fetch announcements");
      console.error("Error fetching announcements:", error);
    } finally {
      setAnnouncementLoading(false);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!newAnnouncement.trim()) {
      toast.error("Announcement cannot be empty");
      return;
    }

    try {
      await announcementService.createAnnouncement({
        content: newAnnouncement,
        date: new Date().toISOString(),
      });
      toast.success("Announcement created successfully");
      setNewAnnouncement("");
      setShowAnnouncementForm(false);
      fetchAnnouncements();
    } catch (error) {
      toast.error(error.message || "Failed to create announcement");
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        await announcementService.deleteAnnouncement(announcementId);
        toast.success("Announcement deleted successfully");
        fetchAnnouncements();
      } catch (error) {
        toast.error(error.message || "Failed to delete announcement");
      }
    }
  };

  const fetchJoinedClubs = async () => {
    try {
      setLoading(true);
      const clubs = await clubService.getAllClubs();
      const user = await authService.getCurrentUser();
      const userClubs = clubs.filter(club => 
        club.members.some(member => member.user._id === user._id)
      );
      setJoinedClubs(userClubs);
    } catch (error) {
      toast.error("Failed to fetch joined clubs");
      console.error("Error fetching joined clubs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingEvent = async () => {
    try {
      setEventLoading(true);
      const events = await eventService.getAllEvents();
      
      // Filter future events and sort by date
      const futureEvents = events
        .filter(event => new Date(event.date) > new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setUpcomingEvent(futureEvents[0] || null);
    } catch (error) {
      toast.error("Failed to fetch upcoming events");
      console.error("Error fetching upcoming events:", error);
    } finally {
      setEventLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="bg-[#0D021E] text-white min-h-screen flex flex-col">
        {/* Top Bar */}
        <header className="p-4 sm:p-6 text-center bg-[rgba(16,4,37,1)] relative w-full overflow-hidden shadow-md">
          <h1 className="text-lg sm:text-xl font-bold">
            Welcome back, <span className="text-blue-400">[User]</span>!
          </h1>

          <div className="bg-gray-800">
            <p className="text-gray-400 max-w-md mx-auto text-sm mt-1 animate-pulse w-full animate-scroll">
              You have <span className="text-blue-300">3</span> upcoming events
              this week!
            </p>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row flex-1 gap-6 p-4 sm:p-6">
          {/* Main Dashboard Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full lg:w-3/4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Clubs Joined */}
              <div className="bg-[#1A0B38] p-4 sm:p-6 rounded-lg shadow-md h-auto sm:h-[13rem]">
                <h3 className="text-lg font-semibold text-center mb-2">
                  Clubs Joined
                </h3>
                {loading ? (
                  <div className="flex justify-center items-center h-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-400 text-center mb-4">
                      {joinedClubs.length} Clubs
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                      {joinedClubs.slice(0, 3).map((club) => (
                        <span
                          key={club._id}
                          className="bg-blue-600 px-3 py-1 rounded-full text-sm"
                        >
                          {club.name}
                        </span>
                      ))}
                      {joinedClubs.length > 3 && (
                        <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">
                          +{joinedClubs.length - 3} more
                        </span>
                      )}
                    </div>
                    <div className="flex justify-center">
                      <button
                        onClick={() => window.location.href = "/clubs"}
                        className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        View All Clubs
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Credits Earned */}
              <div className="bg-[#1A0B38] p-4 sm:p-6 rounded-lg shadow-md h-auto sm:h-[13rem]">
                <h3 className="text-lg font-semibold text-center mb-2">
                  Credits Earned
                </h3>
                <p className="text-gray-400 text-center mb-4">[XX] Points</p>
                <div className="flex justify-center">
                  <button className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Redeem Items
                  </button>
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-[#1A0B38] p-4 sm:p-6 rounded-lg shadow-md h-auto sm:h-[13rem]">
                <h3 className="text-lg font-semibold text-center mb-2">
                  Upcoming Events
                </h3>
                {eventLoading ? (
                  <div className="flex justify-center items-center h-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                  </div>
                ) : upcomingEvent ? (
                  <>
                    <div className="text-center mb-4">
                      <h4 className="text-blue-400 font-semibold mb-1">{upcomingEvent.title}</h4>
                      <div className="flex items-center justify-center text-gray-400 text-sm mb-1">
                        <FaCalendarAlt className="mr-1" />
                        {formatDate(upcomingEvent.date)}
                      </div>
                      <div className="flex items-center justify-center text-gray-400 text-sm">
                        <FaMapMarkerAlt className="mr-1" />
                        {upcomingEvent.location}
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <button
                        onClick={() => window.location.href = "/events"}
                        className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        View All Events
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-gray-400 text-center mb-4">No upcoming events</p>
                    <div className="flex justify-center">
                      <button
                        onClick={() => window.location.href = "/events"}
                        className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Browse Events
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Resources */}
              <div className="bg-[#1A0B38] p-4 sm:p-6 rounded-lg shadow-md h-auto sm:h-[13rem]">
                <h3 className="text-lg font-semibold text-center mb-2">
                  Resources
                </h3>
                <p className="text-gray-400 text-center mb-4">[X] Resources</p>
                <div className="flex justify-center">
                  <button className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    View Resources
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Announcements & Chat */}
          <aside className="w-full lg:w-1/4 bg-[#1A0B38] p-4 sm:p-6 rounded-lg flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">📢 Announcements</h3>
              {isAdmin && (
                <button
                  onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  <FaPlus />
                </button>
              )}
            </div>

            {isAdmin && showAnnouncementForm && (
              <form onSubmit={handleCreateAnnouncement} className="mb-4">
                <textarea
                  value={newAnnouncement}
                  onChange={(e) => setNewAnnouncement(e.target.value)}
                  placeholder="Write your announcement..."
                  className="w-full p-2 rounded-lg bg-gray-800 text-white focus:outline-none mb-2"
                  rows="3"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAnnouncementForm(false)}
                    className="px-3 py-1 rounded bg-gray-600 hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600"
                  >
                    Post
                  </button>
                </div>
              </form>
            )}

            {announcementLoading ? (
              <div className="flex justify-center items-center h-20">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : (
              <div className="space-y-2 flex-grow">
                {announcements.length === 0 ? (
                  <p className="text-gray-400 text-center">No announcements yet</p>
                ) : (
                  announcements.map((announcement) => (
                    <div
                      key={announcement._id}
                      className="bg-gray-700 p-3 rounded-lg relative group"
                    >
                      <p className="text-sm">{announcement.content}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(announcement.date).toLocaleDateString()}
                      </p>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteAnnouncement(announcement._id)}
                          className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Chat */}
            <div className="mt-4">
              <input
                type="text"
                placeholder="Message..."
                className="p-2 w-full rounded-lg bg-gray-800 text-white focus:outline-none mb-2"
              />
              <button className="w-full bg-blue-500 p-2 rounded-lg hover:bg-blue-600 transition-colors">
                Send
              </button>
            </div>
          </aside>
        </div>

        {/* Footer */}
        <footer className="text-center p-4 text-gray-400 bg-[rgba(16,4,37,1)] mt-6">
          Copyright © 2025 Techno Clubs Portal
        </footer>
      </div>
    </div>
  );
};

export default DashboardRight;
