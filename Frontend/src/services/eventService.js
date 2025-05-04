const API_URL = "http://localhost:3000/api";

export const eventService = {
  // Get all events
  getAllEvents: async () => {
    const response = await fetch(`${API_URL}/events`, {
      credentials: "include",
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return data.events;
  },

  // Get event by ID
  getEventById: async (id) => {
    const response = await fetch(`${API_URL}/events/${id}`, {
      credentials: "include",
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return data.event;
  },

  // Register for an event
  registerForEvent: async (eventId) => {
    const response = await fetch(`${API_URL}/events/${eventId}/register`, {
      method: "POST",
      credentials: "include",
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  },

  // Admin Operations

  // Create new event
  createEvent: async (formData) => {
    const response = await fetch(`${API_URL}/events`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return data.event;
  },

  // Update event
  updateEvent: async (eventId, formData) => {
    const response = await fetch(`${API_URL}/events/${eventId}`, {
      method: "PUT",
      credentials: "include",
      body: formData,
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return data.event;
  },

  // Delete event
  deleteEvent: async (eventId) => {
    const response = await fetch(`${API_URL}/events/${eventId}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  },
};
