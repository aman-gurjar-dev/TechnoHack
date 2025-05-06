const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', announcementController.getAllAnnouncements);

// Protected routes
router.get('/:id', protect, announcementController.getAnnouncement);

// Admin only routes
router.post('/', protect, authorize('admin'), announcementController.createAnnouncement);
router.put('/:id', protect, authorize('admin'), announcementController.updateAnnouncement);
router.delete('/:id', protect, authorize('admin'), announcementController.deleteAnnouncement);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

module.exports = router;
