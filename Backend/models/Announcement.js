const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Announcement title is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Announcement content is required'],
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  targetAudience: {
    type: String,
    enum: ['all', 'students', 'faculty', 'admin'],
    default: 'all'
  },
  status: {
    type: String,
    enum: ['active', 'archived'],
    default: 'active'
  },
  expiryDate: {
    type: Date,
    required: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Method to archive an announcement
announcementSchema.methods.archive = async function() {
  this.status = 'archived';
  return this.save();
};

// Index for better query performance
announcementSchema.index({ status: 1, expiryDate: 1 });
announcementSchema.index({ priority: 1 });
announcementSchema.index({ targetAudience: 1 });

module.exports = mongoose.model('Announcement', announcementSchema); 