import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import adminRoutes from './routes/admin.js';
import emailRoutes from './routes/email.js'; // Import email routes

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://georgewoodcasket.com'], // Allowed domains
  methods: 'GET,POST', // Allowed methods
}));
app.use(express.json());

// Set up MongoDB connection
import connectDB from './config/db.js';
connectDB();

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/send-email', emailRoutes); // Use email routes

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
