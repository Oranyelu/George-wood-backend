import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { MongoClient } from 'mongodb';
import connectDB from '../config/db.js';

const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

// Initialize the database connection
let database;
async function connectToDatabase() {
    if (!database) {
        try {
            await client.connect();
            database = client.db('orderDB');
            console.log("Connected to MongoDB");
        } catch (error) {
            console.error("Failed to connect to MongoDB:", error);
            process.exit(1);
        }
    }
    return database;
}

app.post('/api/send-email', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, cart, referral } = req.body;

        if (!firstName || !lastName || !email || !phone || !cart) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const orderSummary = cart.map(item => `${item.name} - ${item.price} NGN`).join(", ");
        const totalPrice = cart.reduce((total, item) => total + item.price, 0);
        const trackingId = crypto.randomBytes(8).toString('hex'); // Generate unique ID

        const emailBody = `
          Hello ${firstName} ${lastName},
          Thank you for your order!
          Here is a summary of your order:
          ${orderSummary}
          Total Price: ${totalPrice.toLocaleString()} NGN
          Referred By: ${referral}

          To complete your order, please make a payment of the sum Total Price: ${totalPrice.toLocaleString()} NGN to the account below.

          George Chiemerie Chime 
          2198210889
          United Bank of Africa (UBA)

          Here is your tracking ID to track the progress of your order: ${trackingId}

          We will contact you at ${phone}.
        `;

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Order Confirmation',
            text: emailBody
        };

        // Send the confirmation email
        await transporter.sendMail(mailOptions);

        // Save order to MongoDB
        try {
            const database = await connectToDatabase();
            const orders = database.collection('orders');
            await orders.insertOne({
                trackingId,
                firstName,
                lastName,
                email,
                phone,
                cart,
                referral,
                totalPrice,
                status: 'Pending',
                createdAt: new Date(),
            });
            res.status(200).json({ message: 'Order placed successfully! A confirmation email has been sent.', trackingId });
        } catch (error) {
            console.error('Error saving order to the database:', error);
            res.status(500).json({ message: 'Error saving order to database' });
        }
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'There was an error processing your request.' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
