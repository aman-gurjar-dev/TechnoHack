import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaCalendarAlt,
  FaBookOpen,
  FaPlus,
  FaEdit,
  FaTrash,
  FaUpload,
  FaChartBar,
  FaChartPie,
  FaChartLine,
  FaSignOutAlt,
  FaUserShield,
  FaBell,
  FaCog,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Bar, Pie, Line } from "react-chartjs-2";
import "chart.js/auto";
import { toast } from "react-hot-toast";
import { authService } from "../services/authService";
import config from "../config";
import { clubService } from "../services/clubService";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    type: "offline",
    fee: 0,
    label: "",
    image: null,
    clubId: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const [showClubForm, setShowClubForm] = useState(false);
  const [clubs, setClubs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [clubData, setClubData] = useState({
    name: "",
    description: "",
    category: "Technical",
    image: null,
  });

  useEffect(() => {
    checkAdminAuth();
    fetchEvents();
    fetchClubs();
  }, []);

  const checkAdminAuth = async () => {
    try {
      console.log("Checking admin authentication...");
      const user = await authService.getCurrentUser();
      console.log("Current user:", user);

      if (!user || user.role !== "admin") {
        console.log("User is not an admin, redirecting to login");
        toast.error("Unauthorized access");
        navigate("/login");
      } else {
        console.log("User is an admin, proceeding to dashboard");
      }
    } catch (error) {
      console.error("Admin auth error:", error);
      toast.error("Please login as admin");
      navigate("/login");
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${config.API_URL}/events`);
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      toast.error("Failed to fetch events");
    }
  };

  const fetchClubs = async () => {
    try {
      const response = await fetch(`${config.API_URL}/clubs`, {
        credentials: "include",
      });
      const data = await response.json();
      setClubs(data.clubs || []);
    } catch (error) {
      toast.error("Failed to fetch clubs");
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!eventData.title.trim()) errors.title = "Title is required";
    if (!eventData.description.trim())
      errors.description = "Description is required";
    if (!eventData.date) errors.date = "Date is required";
    if (!eventData.time) errors.time = "Time is required";
    if (!eventData.location.trim()) errors.location = "Location is required";
    if (!eventData.type) errors.type = "Type is required";
    if (eventData.fee < 0) errors.fee = "Fee cannot be negative";
    if (!eventData.label.trim()) errors.label = "Label is required";
    if (!eventData.image) errors.image = "Image is required";
    if (!eventData.clubId) errors.clubId = "Club is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setEventData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      // Format date and time
      const [year, month, day] = eventData.date.split("-");
      const [hours, minutes] = eventData.time.split(":");
      const eventDateTime = new Date(year, month - 1, day, hours, minutes);

      const formData = new FormData();

      // Add all fields to formData
      formData.append("title", eventData.title);
      formData.append("description", eventData.description);
      formData.append("date", eventDateTime.toISOString());
      formData.append("location", eventData.location);
      formData.append("type", eventData.type);
      formData.append("fee", eventData.fee);
      formData.append("label", eventData.label);
      formData.append("clubId", eventData.clubId);

      if (eventData.image) {
        formData.append("image", eventData.image);
      }

      // Log the form data for debugging
      console.log("Sending event data:", {
        title: eventData.title,
        description: eventData.description,
        date: eventDateTime.toISOString(),
        location: eventData.location,
        type: eventData.type,
        fee: eventData.fee,
        label: eventData.label,
        clubId: eventData.clubId,
        image: eventData.image ? eventData.image.name : null,
      });

      const response = await fetch(`${config.API_URL}/events`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create event");
      }

      toast.success("Event created successfully!");
      setShowEventForm(false);
      setEventData({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        type: "offline",
        fee: 0,
        label: "",
        image: null,
        clubId: "",
      });
      setFormErrors({});
      fetchEvents();
    } catch (error) {
      console.error("Event creation error:", error);
      toast.error(error.message || "Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const response = await fetch(
          `${config.API_URL}/events/${eventId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete event");
        }

        toast.success("Event deleted successfully!");
        fetchEvents();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  // Mock data for dashboard metrics
  const dashboardData = {
    totalClubs: 12,
    totalEvents: 25,
    totalResourcesUsed: 340,
    activeUsers: 156,
  };

  // Mock data for charts
  const eventParticipationData = {
    labels: ["Tech Club", "Art Club", "Sports Club", "Music Club"],
    datasets: [
      {
        label: "Event Participation",
        data: [120, 95, 85, 70],
        backgroundColor: ["#3498db", "#9b59b6", "#2ecc71", "#f1c40f"],
      },
    ],
  };

  const resourceUsageData = {
    labels: ["E-books", "Meeting Rooms", "Softwares"],
    datasets: [
      {
        data: [150, 100, 90],
        backgroundColor: ["#e74c3c", "#8e44ad", "#2c3e50"],
      },
    ],
  };

  const userGrowthData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "User Growth",
        data: [65, 78, 90, 105, 125, 156],
        borderColor: "#3498db",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white"
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm opacity-80">Total Clubs</p>
            <h3 className="text-3xl font-bold mt-1">{clubs.length}</h3>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            <FaUsers className="text-2xl" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <span className="text-sm">Active Clubs</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white"
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm opacity-80">Total Events</p>
            <h3 className="text-3xl font-bold mt-1">{events.length}</h3>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            <FaCalendarAlt className="text-2xl" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <span className="text-sm">Upcoming Events</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white"
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm opacity-80">Total Members</p>
            <h3 className="text-3xl font-bold mt-1">
              {clubs.reduce((total, club) => total + (club.members?.length || 0), 0)}
            </h3>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            <FaUsers className="text-2xl" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <span className="text-sm">Across All Clubs</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl shadow-lg text-white"
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm opacity-80">Active Users</p>
            <h3 className="text-3xl font-bold mt-1">
              {dashboardData.activeUsers}
            </h3>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            <FaUsers className="text-2xl" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <span className="text-sm">Total Users</span>
        </div>
      </motion.div>
    </div>
  );

  const renderCharts = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <h3 className="text-xl font-semibold mb-4">Club Categories</h3>
        <div className="h-64">
          <Pie
            data={{
              labels: ["Technical", "Cultural", "Sports", "Academic", "Other"],
              datasets: [
                {
                  data: [
                    clubs.filter(c => c.category === "Technical").length,
                    clubs.filter(c => c.category === "Cultural").length,
                    clubs.filter(c => c.category === "Sports").length,
                    clubs.filter(c => c.category === "Academic").length,
                    clubs.filter(c => c.category === "Other").length,
                  ],
                  backgroundColor: ["#3498db", "#9b59b6", "#2ecc71", "#f1c40f", "#e74c3c"],
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <h3 className="text-xl font-semibold mb-4">Club Members Distribution</h3>
        <div className="h-64">
          <Bar
            data={{
              labels: clubs.slice(0, 5).map(club => club.name),
              datasets: [
                {
                  label: "Members",
                  data: clubs.slice(0, 5).map(club => club.members?.length || 0),
                  backgroundColor: "#3498db",
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white p-6 rounded-xl shadow-lg lg:col-span-2"
      >
        <h3 className="text-xl font-semibold mb-4">Recent Club Activities</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Club
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Members
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clubs.slice(0, 5).map((club) => (
                <tr key={club._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={club.image}
                        alt={club.name}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {club.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                      {club.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {club.members?.length || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );

  const renderEvents = () => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Events Management</h3>
          <button
            onClick={() => setShowEventForm(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <FaPlus className="mr-2" />
            Add New Event
          </button>
        </div>
      </div>

      {showEventForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 border-b border-gray-200"
        >
          <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Club *
                </label>
                <select
                  name="clubId"
                  value={eventData.clubId}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    formErrors.clubId ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                >
                  <option value="">Select a club</option>
                  {clubs.map((club) => (
                    <option key={club._id} value={club._id}>
                      {club.name}
                    </option>
                  ))}
                </select>
                {formErrors.clubId && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.clubId}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={eventData.title}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    formErrors.title ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {formErrors.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.title}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Event Label *
                </label>
                <input
                  type="text"
                  name="label"
                  value={eventData.label}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    formErrors.label ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {formErrors.label && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.label}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Event Type *
                </label>
                <select
                  name="type"
                  value={eventData.type}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    formErrors.type ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                >
                  <option value="offline">Offline</option>
                  <option value="online">Online</option>
                </select>
                {formErrors.type && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.type}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fee (₹) *
                </label>
                <input
                  type="number"
                  name="fee"
                  value={eventData.fee}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    formErrors.fee ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {formErrors.fee && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.fee}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={eventData.date}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    formErrors.date ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {formErrors.date && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.date}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Time *
                </label>
                <input
                  type="time"
                  name="time"
                  value={eventData.time}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    formErrors.time ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {formErrors.time && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.time}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={eventData.location}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    formErrors.location ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {formErrors.location && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.location}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Event Image *
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={handleImageChange}
                  accept="image/*"
                  className={`mt-1 block w-full ${
                    formErrors.image ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {formErrors.image && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.image}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                name="description"
                value={eventData.description}
                onChange={handleInputChange}
                rows="4"
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  formErrors.description ? "border-red-500" : "border-gray-300"
                }`}
                required
              ></textarea>
              {formErrors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.description}
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowEventForm(false);
                  setFormErrors({});
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Event"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capacity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={`${config.API_URL}${event.image}`}
                      alt={event.title}
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {event.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {event.category}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{event.date}</div>
                  <div className="text-sm text-gray-500">{event.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{event.location}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{event.capacity}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${event.price}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const handleClubInputChange = (e) => {
    const { name, value } = e.target;
    setClubData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClubImageChange = (e) => {
    if (e.target.files[0]) {
      setClubData((prev) => ({
        ...prev,
        image: e.target.files[0],
      }));
    }
  };

  const handleClubSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(clubData).forEach((key) => {
        formData.append(key, clubData[key]);
      });

      if (isEditing) {
        await clubService.updateClub(selectedClub._id, formData);
        toast.success("Club updated successfully!");
      } else {
        await clubService.createClub(formData);
        toast.success("Club created successfully!");
      }

      setShowClubForm(false);
      setClubData({
        name: "",
        description: "",
        category: "Technical",
        image: null,
      });
      setIsEditing(false);
      setSelectedClub(null);
      fetchClubs();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEditClub = (club) => {
    setSelectedClub(club);
    setIsEditing(true);
    setClubData({
      name: club.name,
      description: club.description,
      category: club.category,
      image: null,
    });
    setShowClubForm(true);
  };

  const handleDeleteClub = async (clubId) => {
    if (window.confirm("Are you sure you want to delete this club?")) {
      try {
        await clubService.deleteClub(clubId);
        toast.success("Club deleted successfully!");
        fetchClubs();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const renderClubs = () => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Clubs Management</h3>
          <button
            onClick={() => setShowClubForm(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <FaPlus className="mr-2" />
            Create Club
          </button>
        </div>
      </div>

      {showClubForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 border-b border-gray-200"
        >
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? "Edit Club" : "Create New Club"}
          </h2>
          <form onSubmit={handleClubSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Club Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={clubData.name}
                  onChange={handleClubInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  name="category"
                  value={clubData.category}
                  onChange={handleClubInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="Technical">Technical</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                  <option value="Academic">Academic</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                name="description"
                value={clubData.description}
                onChange={handleClubInputChange}
                rows="3"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Club Image *
              </label>
              <input
                type="file"
                onChange={handleClubImageChange}
                accept="image/*"
                className="mt-1 block w-full"
                required={!isEditing}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowClubForm(false);
                  setClubData({
                    name: "",
                    description: "",
                    category: "Technical",
                    image: null,
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                {isEditing ? "Update Club" : "Create Club"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <motion.div
              key={club._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
            >
              <div className="relative h-48">
                <img
                  src={club.image}
                  alt={club.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => handleEditClub(club)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                  >
                    <FaEdit className="text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteClub(club._id)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                  >
                    <FaTrash className="text-red-600" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {club.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {club.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs">
                    {club.category}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs">
                    {club.members?.length || 0} Members
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                <FaBell className="text-xl" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                <FaCog className="text-xl" />
              </button>
              <button
                onClick={() => navigate('/admin/clubs')}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                <FaUsers className="mr-2" />
                Manage Clubs
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "events"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setActiveTab("clubs")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "clubs"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Clubs
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "users"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "settings"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Settings
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <>
            {renderOverview()}
            {renderCharts()}
          </>
        )}
        {activeTab === "events" && renderEvents()}
        {activeTab === "clubs" && renderClubs()}
        {activeTab === "users" && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">User Management</h3>
            <p className="text-gray-500">
              User management features coming soon.
            </p>
          </div>
        )}
        {activeTab === "settings" && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Settings</h3>
            <p className="text-gray-500">Settings features coming soon.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
