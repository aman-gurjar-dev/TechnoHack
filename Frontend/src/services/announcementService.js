import config from '../config';

const API_URL = config.API_URL;

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const announcementService = {
  // Get all announcements
  getAllAnnouncements: async () => {
    try {
      const response = await fetch(`${API_URL}/announcements`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          // Clear token if unauthorized
          localStorage.removeItem('token');
        }
        throw new Error(data.message || "Failed to fetch announcements");
      }
      return data.announcements;
    } catch (error) {
      console.error("Error fetching announcements:", error);
      throw error;
    }
  },

  // Create new announcement (admin only)
  createAnnouncement: async (announcementData) => {
    try {
      const response = await fetch(`${API_URL}/announcements`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(announcementData),
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          // Clear token if unauthorized
          localStorage.removeItem('token');
        }
        throw new Error(data.message || "Failed to create announcement");
      }
      return data.announcement;
    } catch (error) {
      console.error("Error creating announcement:", error);
      throw error;
    }
  },

  // Update announcement (admin only)
  updateAnnouncement: async (announcementId, announcementData) => {
    try {
      const response = await fetch(`${API_URL}/announcements/${announcementId}`, {
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(announcementData),
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          // Clear token if unauthorized
          localStorage.removeItem('token');
        }
        throw new Error(data.message || "Failed to update announcement");
      }
      return data.announcement;
    } catch (error) {
      console.error("Error updating announcement:", error);
      throw error;
    }
  },

  // Delete announcement (admin only)
  deleteAnnouncement: async (announcementId) => {
    try {
      const response = await fetch(`${API_URL}/announcements/${announcementId}`, {
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          // Clear token if unauthorized
          localStorage.removeItem('token');
        }
        throw new Error(data.message || "Failed to delete announcement");
      }
      return data;
    } catch (error) {
      console.error("Error deleting announcement:", error);
      throw error;
    }
  },
}; 