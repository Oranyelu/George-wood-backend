import express from 'express';
import { createOrder, updateOrderStatus, getOrderByTrackingId, getAllOrders } from '../api/order-controller.js';

const router = express.Router();

// Create a new order
router.post('/order', createOrder);

// Update order status
router.put('/order-status/:trackingId', updateOrderStatus);

// Get order by tracking ID
router.get('/order-status/:trackingId', getOrderByTrackingId);

// Get all orders (for admin)
router.get('/orders', getAllOrders);

export default router; // Use `export default` for ES module
