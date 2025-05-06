import config from '../config';

const API_URL = config.API_URL;

// Cache for events data
let eventsCache = null;
let lastFetchTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const eventService = {
  // Get all events
  getAllEvents: async () => {
    // Return cached data if it's still valid
    if (eventsCache && lastFetchTime && (Date.now() - lastFetchTime < CACHE_DURATION)) {
      return eventsCache;
    }

    try {
      console.log("Fetching events from:", `${API_URL}/events`);
      const response = await fetch(`${API_URL}/events`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error("Error response:", data);
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      if (!data.success) {
        console.error("API error:", data);
        throw new Error(data.message || 'Failed to fetch events');
      }
      
      // Update cache
      eventsCache = data.events;
      lastFetchTime = Date.now();
      
      return data.events;
    } catch (error) {
      console.error("Error fetching events:", error);
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to the server. Please check your internet connection.');
      }
      throw new Error(`Failed to fetch events: ${error.message}`);
    }
  },

  // Clear cache
  clearCache: () => {
    eventsCache = null;
    lastFetchTime = null;
  },

  // Get event by ID
  getEventById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/events/${id}`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch event');
      }
      
      return data.event;
    } catch (error) {
      console.error("Error fetching event:", error);
      throw new Error(`Failed to fetch event: ${error.message}`);
    }
  },

  // Register for an event
  registerForEvent: async (eventId) => {
    try {
      const response = await fetch(`${API_URL}/events/${eventId}/register`, {
        method: "POST",
        headers: getHeaders(),
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to register for event');
      }
      
      return data;
    } catch (error) {
      console.error("Error registering for event:", error);
      throw new Error(`Failed to register for event: ${error.message}`);
    }
  },

  // Create new event (admin only)
  createEvent: async (formData) => {
    try {
      const headers = getHeaders();
      delete headers['Content-Type']; // Let the browser set the correct content type for FormData
      
      const response = await fetch(`${API_URL}/events`, {
        method: "POST",
        headers,
        credentials: 'include',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to create event');
      }
      
      return data.event;
    } catch (error) {
      console.error("Error creating event:", error);
      throw new Error(`Failed to create event: ${error.message}`);
    }
  },

  // Update event (admin only)
  updateEvent: async (eventId, formData) => {
    try {
      const headers = getHeaders();
      delete headers['Content-Type']; // Let the browser set the correct content type for FormData
      
      const response = await fetch(`${API_URL}/events/${eventId}`, {
        method: "PUT",
        headers,
        credentials: 'include',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to update event');
      }
      
      return data.event;
    } catch (error) {
      console.error("Error updating event:", error);
      throw new Error(`Failed to update event: ${error.message}`);
    }
  },

  // Delete event (admin only)
  deleteEvent: async (eventId) => {
    try {
      const response = await fetch(`${API_URL}/events/${eventId}`, {
        method: "DELETE",
        headers: getHeaders(),
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to delete event');
      }
      
      return data;
    } catch (error) {
      console.error("Error deleting event:", error);
      throw new Error(`Failed to delete event: ${error.message}`);
    }
  },

  // Get event registrations (admin only)
  getEventRegistrations: async (eventId) => {
    try {
      const response = await fetch(`${API_URL}/events/${eventId}/registrations`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch registrations');
      }
      
      return data.registrations;
    } catch (error) {
      console.error("Error fetching registrations:", error);
      throw new Error(`Failed to fetch registrations: ${error.message}`);
    }
  },
};
