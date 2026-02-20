const express = require('express');
const {
  getLinks,
  getAllLinks,
  createLink,
  updateLink,
  deleteLink
} = require('../controllers/linkController');
const { auth, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getLinks); // public
router.get('/all', protect, admin, getAllLinks);
router.route('/')
  .post(protect, admin, createLink);

router.route('/:id')
  .put(protect, admin, updateLink)
  .delete(protect, admin, deleteLink);

module.exports = router;