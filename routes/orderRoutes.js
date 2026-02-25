const express = require('express');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/orderController');

const { auth, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .post(createOrder) // make auth required if needed
  .get(auth, authorizeRoles('admin'), getOrders);

router.get('/:id', auth, authorizeRoles('admin'), getOrderById);
router.put('/:id/status', auth, authorizeRoles('admin'), updateOrderStatus);

module.exports = router;