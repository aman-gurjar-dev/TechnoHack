import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { eventService } from "../services/eventService";
import Sidebar from "../components/Sidebar";

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    type: "offline",
    fee: 0,
    label: "",
    status: "upcoming",
  });
  const [image, setImage] = useState(null);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
      if (image) {
        formDataToSend.append("image", image);
      }

      if (isEditing) {
        await eventService.updateEvent(selectedEvent._id, formDataToSend);
        toast.success("Event updated successfully!");
      } else {
        await eventService.createEvent(formDataToSend);
        toast.success("Event created successfully!");
      }

      fetchEvents();
      resetForm();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setIsEditing(true);
    setFormData({
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString().split("T")[0],
      location: event.location,
      type: event.type,
      fee: event.fee,
      label: event.label,
      status: event.status,
    });
  };

  const handleDelete = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await eventService.deleteEvent(eventId);
        toast.success("Event deleted successfully!");
        fetchEvents();
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const resetForm = () => {
    setSelectedEvent(null);
    setIsEditing(false);
    setFormData({
      title: "",
      description: "",
      date: "",
      location: "",
      type: "offline",
      fee: 0,
      label: "",
      status: "upcoming",
    });
    setImage(null);
  };

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
    <div className="bg-[#100425] min-h-screen flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-bold text-white mb-8"
        >
          Manage Events
        </motion.h1>

        {/* Event Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[#49478C] p-6 rounded-lg mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-4">
            {isEditing ? "Edit Event" : "Create New Event"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="title"
                placeholder="Event Title"
                value={formData.title}
                onChange={handleInputChange}
                className="p-2 rounded bg-gray-800 text-white"
                required
              />
              <input
                type="text"
                name="label"
                placeholder="Event Label"
                value={formData.label}
                onChange={handleInputChange}
                className="p-2 rounded bg-gray-800 text-white"
                required
              />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="p-2 rounded bg-gray-800 text-white"
                required
              />
              <input
                type="text"
                name="location"
                placeholder="Event Location"
                value={formData.location}
                onChange={handleInputChange}
                className="p-2 rounded bg-gray-800 text-white"
                required
              />
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="p-2 rounded bg-gray-800 text-white"
                required
              >
                <option value="offline">Offline</option>
                <option value="online">Online</option>
              </select>
              <input
                type="number"
                name="fee"
                placeholder="Event Fee"
                value={formData.fee}
                onChange={handleInputChange}
                className="p-2 rounded bg-gray-800 text-white"
                required
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="p-2 rounded bg-gray-800 text-white"
                required
              >
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
              <input
                type="file"
                onChange={handleImageChange}
                className="p-2 rounded bg-gray-800 text-white"
                accept="image/*"
              />
            </div>
            <textarea
              name="description"
              placeholder="Event Description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-gray-800 text-white h-32"
              required
            />
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {isEditing ? "Update Event" : "Create Event"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Events List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[#49478C] p-6 rounded-lg"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Events List</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="p-2 text-left">Title</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Location</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event._id} className="border-b border-gray-700">
                    <td className="p-2">{event.title}</td>
                    <td className="p-2">
                      {new Date(event.date).toLocaleDateString()}
                    </td>
                    <td className="p-2">{event.location}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded ${
                          event.status === "upcoming"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        {event.status}
                      </span>
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => handleEdit(event)}
                        className="px-3 py-1 bg-blue-500 text-white rounded mr-2 hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminEvents;
