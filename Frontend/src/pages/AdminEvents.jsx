import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { eventService } from "../services/eventService";
import { FaPlus, FaEdit, FaTrash, FaUsers } from "react-icons/fa";
import EventRegistrations from "../components/EventRegistrations";
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
  const [showRegistrations, setShowRegistrations] = useState(false);

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

  const handleViewRegistrations = (event) => {
    setSelectedEvent(event);
    setShowRegistrations(true);
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

        {showRegistrations ? (
          <div>
            <button
              onClick={() => setShowRegistrations(false)}
              className="mb-4 text-white hover:text-indigo-300 flex items-center"
            >
              ← Back to Events
            </button>
            <EventRegistrations eventId={selectedEvent._id} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {event.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                      {event.type}
                    </span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {event.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleViewRegistrations(event)}
                      className="text-indigo-600 hover:text-indigo-800 flex items-center"
                    >
                      <FaUsers className="mr-1" />
                      View Registrations
                    </button>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(event)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEvents;
