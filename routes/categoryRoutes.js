const express = require('express');
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

const { auth, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post(auth, authorizeRoles('admin'), createCategory);

router.route('/:id')
  .get(getCategoryById)
  .put(auth, authorizeRoles('admin'), updateCategory)
  .delete(auth, authorizeRoles('admin'), deleteCategory);

module.exports = router;