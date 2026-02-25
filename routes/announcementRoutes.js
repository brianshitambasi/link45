const express = require('express');
const {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} = require('../controllers/announcementController');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Public route to get all announcements
router.get('/', getAnnouncements);

// Admin-only routes
router.post('/',auth, createAnnouncement);
router.put('/:id',auth, updateAnnouncement);
router.delete('/:id',auth, deleteAnnouncement);

module.exports = router;