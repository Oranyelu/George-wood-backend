

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from '../config/db.js';

connectDB();

console.log('MONGODB_URI:', process.env.MONGODB_URI); // Check if this logs the correct URI

// Rest of the code

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('MONGODB_URI is not defined in the .env file');
  process.exit(1);
}

const client = new MongoClient(uri);

export async function getOrderStatus(trackingId) {
  try {
    await client.connect();
    const database = client.db('orderTracking');
    const orders = database.collection('orders');

    const order = await orders.findOne({ trackingId });
    return order;
  } catch (error) {
    console.error('Error fetching order status:', error);
    throw error;
  } finally {
    await client.close();
  }
}
