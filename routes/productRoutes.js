const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const { auth, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(auth, authorizeRoles('admin'), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(auth, authorizeRoles('admin'), updateProduct)
  .delete(auth, authorizeRoles('admin'), deleteProduct);

module.exports = router;