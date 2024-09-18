import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  items: [{ productName: String, quantity: Number }],
  status: { type: String, default: 'pending' },
  trackingId: { type: String, unique: true },
  orderDate: { type: Date, default: Date.now },
  deliveryDate: { type: Date }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
