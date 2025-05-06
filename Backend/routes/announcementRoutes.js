const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');

// Get all announcements
router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: announcements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get single announcement
router.get('/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!announcement) {
      return res.status(404).json({
        success: false,
        error: 'Announcement not found'
      });
    }

    res.status(200).json({
      success: true,
      data: announcement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create announcement
router.post('/', async (req, res) => {
  try {
    // Validate required fields
    const { title, content, userId, priority, targetAudience, status } = req.body;
    
    if (!title || !content || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide title, content, and userId'
      });
    }

    // Create new announcement
    const announcement = new Announcement({
      title,
      content,
      createdBy: userId,
      priority: priority || 'medium',
      targetAudience: targetAudience || 'all',
      status: status || 'active',
      isPublished: true
    });

    await announcement.save();
    
    // Populate creator details
    const populatedAnnouncement = await announcement.populate('createdBy', 'name email');
    
    // Return success response with the new announcement
    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: populatedAnnouncement
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Update announcement
router.put('/:id', async (req, res) => {
  try {
    const { title, content, userId, priority, targetAudience, status } = req.body;

    const updateData = {
      title,
      content,
      updatedBy: userId,
      priority,
      targetAudience,
      status,
      updatedAt: new Date()
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!announcement) {
      return res.status(404).json({
        success: false,
        error: 'Announcement not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Announcement updated successfully',
      data: announcement
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Delete announcement
router.delete('/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        error: 'Announcement not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
