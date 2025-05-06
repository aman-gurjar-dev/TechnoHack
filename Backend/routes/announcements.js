const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const Announcement = require('../models/Announcement');

// Get all active announcements with filtering and pagination
router.get('/', verifyToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      priority,
      targetAudience,
      status = 'active',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { status };
    if (priority) query.priority = priority;
    if (targetAudience) query.targetAudience = targetAudience;
    
    // Add expiry date check for active announcements
    if (status === 'active') {
      query.expiryDate = { $gt: new Date() };
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await Announcement.countDocuments(query);

    // Get announcements with pagination and sorting
    const announcements = await Announcement.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    res.json({
      success: true,
      data: announcements,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get announcement by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    res.json({ success: true, data: announcement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new announcement (admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const {
      title,
      content,
      priority,
      targetAudience,
      expiryDate
    } = req.body;

    const announcement = new Announcement({
      title,
      content,
      priority,
      targetAudience,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      createdBy: req.user._id
    });

    await announcement.save();
    
    const populatedAnnouncement = await announcement.populate('createdBy', 'name email');
    
    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: populatedAnnouncement
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update announcement (admin only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const {
      title,
      content,
      priority,
      targetAudience,
      status,
      expiryDate
    } = req.body;

    const updateData = {
      title,
      content,
      priority,
      targetAudience,
      status,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      updatedBy: req.user._id
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email')
     .populate('updatedBy', 'name email');

    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    res.json({
      success: true,
      message: 'Announcement updated successfully',
      data: announcement
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Archive announcement (admin only)
router.patch('/:id/archive', verifyToken, isAdmin, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    await announcement.archive();
    
    res.json({
      success: true,
      message: 'Announcement archived successfully',
      data: announcement
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete announcement (admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }
    
    res.json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router; 