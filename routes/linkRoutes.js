const express = require('express');
const {
  getLinks,
  getAllLinks,
  createLink,
  updateLink,
  deleteLink
} = require('../controllers/linkController');

const { auth, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/', getLinks); // public

router.get('/all', auth, authorizeRoles('admin'), getAllLinks);

router.route('/')
  .post(auth, authorizeRoles('admin'), createLink);

router.route('/:id')
  .put(auth, authorizeRoles('admin'), updateLink)
  .delete(auth, authorizeRoles('admin'), deleteLink);

module.exports = router;