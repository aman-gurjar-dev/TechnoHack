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
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    checkAdminAuth();
    fetchEvents();
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
      const response = await fetch("http://localhost:3000/api/events");
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      toast.error("Failed to fetch events");
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
        image: eventData.image ? eventData.image.name : null,
      });

      const response = await fetch("http://localhost:3000/api/events", {
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
          `http://localhost:3000/api/events/${eventId}`,
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
            <h3 className="text-3xl font-bold mt-1">
              {dashboardData.totalClubs}
            </h3>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            <FaUsers className="text-2xl" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <span className="text-sm">+5% from last month</span>
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
            <h3 className="text-3xl font-bold mt-1">
              {dashboardData.totalEvents}
            </h3>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            <FaCalendarAlt className="text-2xl" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <span className="text-sm">+12% from last month</span>
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
            <p className="text-sm opacity-80">Resources Used</p>
            <h3 className="text-3xl font-bold mt-1">
              {dashboardData.totalResourcesUsed}
            </h3>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            <FaBookOpen className="text-2xl" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <span className="text-sm">+8% from last month</span>
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
          <span className="text-sm">+15% from last month</span>
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
        <h3 className="text-xl font-semibold mb-4">Event Participation</h3>
        <div className="h-64">
          <Bar
            data={eventParticipationData}
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
        transition={{ delay: 0.6 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <h3 className="text-xl font-semibold mb-4">Resource Usage</h3>
        <div className="h-64">
          <Pie
            data={resourceUsageData}
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
        transition={{ delay: 0.7 }}
        className="bg-white p-6 rounded-xl shadow-lg lg:col-span-2"
      >
        <h3 className="text-xl font-semibold mb-4">User Growth</h3>
        <div className="h-64">
          <Line
            data={userGrowthData}
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
                      src={`http://localhost:3000${event.image}`}
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
