import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import adminRoutes from './routes/admin-routes.js';
import emailRoutes from './routes/email.js'; // Import email routes
import connectDB from './config/db.js'; // Move this up for consistency

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://georgewoodcasket.com'], // Allowed domains
  methods: 'GET,POST', // Allowed methods
}));
app.use(express.json());

// Set up MongoDB connection
connectDB();

// Routes
app.use('/routes/admin-routes.js', adminRoutes);
app.use('./routes/email.js', emailRoutes); // Use email routes

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
