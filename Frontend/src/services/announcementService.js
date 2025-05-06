import { API_URL } from '../config';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
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
          localStorage.removeItem('token');
        }
        throw new Error(data.message || "Failed to fetch announcements");
      }
      return data.data;
    } catch (error) {
      console.error("Error fetching announcements:", error);
      throw error;
    }
  },

  // Create new announcement
  createAnnouncement: async (announcementData) => {
    try {
      console.log('Creating announcement with data:', announcementData); // Debug log
      
      const response = await fetch(`${API_URL}/announcements`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          title: announcementData.title || 'Announcement',
          content: announcementData.content,
          priority: announcementData.priority || 'medium',
          targetAudience: announcementData.targetAudience || 'all',
          status: announcementData.status || 'active',
          userId: announcementData.userId
        }),
      });

      const data = await response.json();
      console.log('Server response:', data); // Debug log

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
        }
        throw new Error(data.message || data.error || "Failed to create announcement");
      }
      return data.data;
    } catch (error) {
      console.error("Error creating announcement:", error);
      throw error;
    }
  },

  // Update announcement
  updateAnnouncement: async (announcementId, announcementData) => {
    try {
      const response = await fetch(`${API_URL}/announcements/${announcementId}`, {
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          title: announcementData.title,
          content: announcementData.content,
          priority: announcementData.priority,
          targetAudience: announcementData.targetAudience,
          status: announcementData.status,
          userId: announcementData.userId
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
        }
        throw new Error(data.message || data.error || "Failed to update announcement");
      }
      return data.data;
    } catch (error) {
      console.error("Error updating announcement:", error);
      throw error;
    }
  },

  // Delete announcement
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
          localStorage.removeItem('token');
        }
        throw new Error(data.message || data.error || "Failed to delete announcement");
      }
      return data;
    } catch (error) {
      console.error("Error deleting announcement:", error);
      throw error;
    }
  },
}; 