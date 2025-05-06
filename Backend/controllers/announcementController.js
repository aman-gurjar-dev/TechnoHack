const Announcement = require('../models/Announcement');
const { validateObjectId } = require('../utils/validators');

// Input validation middleware
const validateAnnouncementInput = (req, res, next) => {
  const { title, content, priority, targetAudience } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({
      success: false,
      error: 'Title and content are required'
    });
  }

  if (priority && !['low', 'medium', 'high'].includes(priority)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid priority level'
    });
  }

  if (targetAudience && !['all', 'students', 'teachers'].includes(targetAudience)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid target audience'
    });
  }

  next();
};

// Create a new announcement
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content, priority, targetAudience, expiryDate } = req.body;

    const announcement = new Announcement({
      title,
      content,
      priority,
      targetAudience,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      createdBy: req.user._id
    });

    await announcement.save();

    const populatedAnnouncement = await announcement.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: populatedAnnouncement
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get all announcements
exports.getAllAnnouncements = async (req, res) => {
  try {
    const { status = 'active', targetAudience, page = 1, limit = 10 } = req.query;
    const query = { status };

    // If targetAudience is specified, add it to the query
    if (targetAudience) {
      query.targetAudience = { $in: [targetAudience, 'all'] };
    }

    // Add expiry date check for active announcements
    if (status === 'active') {
      query.$or = [
        { expiryDate: { $gt: new Date() } },
        { expiryDate: null }
      ];
    }

    const skip = (page - 1) * limit;
    const total = await Announcement.countDocuments(query);

    const announcements = await Announcement.find(query)
      .sort({ priority: 1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'name email');

    res.status(200).json({
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
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get a single announcement
exports.getAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid announcement ID'
      });
    }

    const announcement = await Announcement.findById(id)
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
};

// Update an announcement
exports.updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, priority, targetAudience, status, expiryDate } = req.body;

    if (!validateObjectId(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid announcement ID'
      });
    }

    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        error: 'Announcement not found'
      });
    }

    // Check if user is authorized to update
    if (announcement.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this announcement'
      });
    }

    const updateData = {
      title,
      content,
      priority,
      targetAudience,
      status,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      updatedBy: req.user._id
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email')
     .populate('updatedBy', 'name email');

    res.status(200).json({
      success: true,
      data: updatedAnnouncement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Delete an announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid announcement ID'
      });
    }

    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        error: 'Announcement not found'
      });
    }

    // Check if user is authorized to delete
    if (announcement.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this announcement'
      });
    }

    await announcement.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Archive expired announcements (can be run as a cron job)
exports.archiveExpiredAnnouncements = async () => {
  try {
    const result = await Announcement.updateMany(
      {
        status: 'active',
        expiryDate: { $lt: new Date() }
      },
      {
        $set: { status: 'archived' }
      }
    );

    return result;
  } catch (error) {
    console.error('Error archiving expired announcements:', error);
    throw error;
  }
}; 