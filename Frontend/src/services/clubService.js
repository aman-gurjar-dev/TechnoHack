import config from '../config';

const API_URL = config.API_URL;

// Cache for clubs data
let clubsCache = null;
let lastFetchTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const clubService = {
  // Get all clubs
  getAllClubs: async () => {
    // Return cached data if it's still valid
    if (clubsCache && lastFetchTime && (Date.now() - lastFetchTime < CACHE_DURATION)) {
      return clubsCache;
    }

    const response = await fetch(`${API_URL}/clubs`, {
      credentials: "include",
      headers: getHeaders(),
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    
    // Update cache
    clubsCache = data.clubs;
    lastFetchTime = Date.now();
    
    return data.clubs;
  },

  // Clear cache
  clearCache: () => {
    clubsCache = null;
    lastFetchTime = null;
  },

  // Get club by ID
  getClubById: async (id) => {
    const response = await fetch(`${API_URL}/clubs/${id}`, {
      credentials: "include",
      headers: getHeaders(),
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return data.club;
  },

  // Create new club (admin only)
  createClub: async (formData) => {
    const headers = getHeaders();
    delete headers['Content-Type']; // Let the browser set the correct content type for FormData

    const response = await fetch(`${API_URL}/clubs`, {
      method: "POST",
      credentials: "include",
      headers,
      body: formData,
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return data.club;
  },

  // Update club (admin only)
  updateClub: async (id, formData) => {
    const headers = getHeaders();
    delete headers['Content-Type']; // Let the browser set the correct content type for FormData

    const response = await fetch(`${API_URL}/clubs/${id}`, {
      method: "PUT",
      credentials: "include",
      headers,
      body: formData,
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return data.club;
  },

  // Delete club (admin only)
  deleteClub: async (id) => {
    const response = await fetch(`${API_URL}/clubs/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: getHeaders(),
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  },

  // Join club
  joinClub: async (id) => {
    const response = await fetch(`${API_URL}/clubs/${id}/join`, {
      method: "POST",
      credentials: "include",
      headers: getHeaders(),
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  },

  // Leave club
  leaveClub: async (id) => {
    const response = await fetch(`${API_URL}/clubs/${id}/leave`, {
      method: "POST",
      credentials: "include",
      headers: getHeaders(),
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  },
}; 