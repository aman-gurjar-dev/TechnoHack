const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high'],
      message: 'Priority must be low, medium, or high'
    },
    default: 'medium'
  },
  targetAudience: {
    type: String,
    enum: {
      values: ['all', 'students', 'teachers'],
      message: 'Target audience must be all, students, or teachers'
    },
    default: 'all'
  },
  status: {
    type: String,
    enum: {
      values: ['draft', 'active', 'archived'],
      message: 'Status must be draft, active, or archived'
    },
    default: 'draft'
  },
  expiryDate: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v > new Date();
      },
      message: 'Expiry date must be in the future'
    }
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
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Method to archive an announcement
announcementSchema.methods.archive = async function() {
  this.status = 'archived';
  return this.save();
};

// Add index for better query performance
announcementSchema.index({ status: 1, priority: 1, createdAt: -1 });
announcementSchema.index({ targetAudience: 1, status: 1 });
announcementSchema.index({ expiryDate: 1, status: 1 });

// Virtual for checking if announcement is expired
announcementSchema.virtual('isExpired').get(function() {
  if (!this.expiryDate) return false;
  return this.expiryDate < new Date();
});

// Pre-save middleware to handle status updates
announcementSchema.pre('save', function(next) {
  if (this.isModified('expiryDate') && this.expiryDate < new Date()) {
    this.status = 'archived';
  }
  next();
});

// Static method to find active announcements
announcementSchema.statics.findActive = function() {
  return this.find({
    status: 'active',
    $or: [
      { expiryDate: { $gt: new Date() } },
      { expiryDate: null }
    ]
  });
};

// Instance method to check if user can modify
announcementSchema.methods.canModify = function(userId, userRole) {
  return this.createdBy.toString() === userId.toString() || userRole === 'admin';
};

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement; 