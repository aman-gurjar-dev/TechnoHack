import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { clubService } from "../services/clubService";
import { authService } from "../services/authService";
import { eventService } from "../services/eventService";
import { announcementService } from "../services/announcementService";
import { FaUsers, FaCalendarAlt, FaBookOpen, FaMapMarkerAlt, FaPlus, FaTrash, FaBullhorn, FaPaperPlane, FaClock } from "react-icons/fa";
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
      // Filter active announcements and sort by priority and date
      const activeAnnouncements = fetchedAnnouncements
        .filter(announcement => announcement.status === "active")
        .sort((a, b) => {
          // First sort by priority
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
          if (priorityDiff !== 0) return priorityDiff;
          // Then sort by date (newest first)
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
      setAnnouncements(activeAnnouncements);
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
        title: "Announcement",
        content: newAnnouncement,
        priority: "medium",
        targetAudience: "all",
        status: "active"
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
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const userClubs = clubs.filter(club => 
        club.members && club.members.some(member => 
          member.user && member.user._id === user._id
        )
      );
      
      setJoinedClubs(userClubs);
    } catch (error) {
      console.error("Error fetching joined clubs:", error);
      toast.error(error.message || "Failed to fetch joined clubs");
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
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <FaBullhorn className="text-blue-400 text-xl" />
                <h3 className="text-lg font-semibold">Announcements</h3>
              </div>
              {isAdmin && (
                <button
                  onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <FaPlus />
                </button>
              )}
            </div>

            {isAdmin && showAnnouncementForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-lg p-4 mb-4"
              >
                <form onSubmit={handleCreateAnnouncement} className="space-y-3">
                  <textarea
                    value={newAnnouncement}
                    onChange={(e) => setNewAnnouncement(e.target.value)}
                    placeholder="Write your announcement..."
                    className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows="3"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowAnnouncementForm(false)}
                      className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
                    >
                      Post
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {announcementLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400"></div>
              </div>
            ) : (
              <div className="space-y-3 flex-grow overflow-y-auto max-h-[400px] pr-2">
                {announcements.length === 0 ? (
                  <div className="text-center py-8">
                    <FaBullhorn className="text-gray-600 text-4xl mx-auto mb-2" />
                    <p className="text-gray-400">No announcements yet</p>
                  </div>
                ) : (
                  announcements.map((announcement) => (
                    <motion.div
                      key={announcement._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-800 rounded-lg p-4 relative group hover:bg-gray-750 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="text-blue-400 font-medium">
                              {announcement.title}
                            </h4>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              announcement.priority === 'high' 
                                ? 'bg-red-900/30 text-red-400' 
                                : announcement.priority === 'medium'
                                ? 'bg-yellow-900/30 text-yellow-400'
                                : 'bg-green-900/30 text-green-400'
                            }`}>
                              {announcement.priority}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm mb-2">
                            {announcement.content}
                          </p>
                          <div className="flex items-center space-x-3 text-xs text-gray-400">
                            <span className="flex items-center">
                              <FaCalendarAlt className="mr-1" />
                              {new Date(announcement.createdAt).toLocaleDateString()}
                            </span>
                            {announcement.expiryDate && (
                              <span className="flex items-center">
                                <FaClock className="mr-1" />
                                Expires: {new Date(announcement.expiryDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteAnnouncement(announcement._id)}
                            className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-900/30 rounded"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {/* Chat Section */}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex items-center space-x-2 mb-3">
                <FaUsers className="text-blue-400" />
                <h4 className="text-sm font-medium">Quick Chat</h4>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="w-full py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2">
                  <span>Send Message</span>
                  <FaPaperPlane className="text-sm" />
                </button>
              </div>
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
