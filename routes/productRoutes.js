const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const { auth, authorizeRoles } = require('../middleware/auth');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Public routes
router.route('/')
  .get(getProducts);

// Admin protected routes
router.route('/')
  .post(auth, authorizeRoles('admin'), upload.single('image'), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(auth, authorizeRoles('admin'), upload.single('image'), updateProduct)
  .delete(auth, authorizeRoles('admin'), deleteProduct);

module.exports = router;