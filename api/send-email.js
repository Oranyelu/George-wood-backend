import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { MongoClient } from 'mongodb';

const app = express();
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json());

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

        await transporter.sendMail(mailOptions);

        // Store the order in the database
        await client.connect();
        const database = client.db('orderDB');
        const orders = database.collection('orders');

        const orderData = {
            trackingId,
            firstName,
            lastName,
            email,
            phone,
            orderSummary,
            totalPrice,
            referral,
            status: 'Pending', // Order status, can be 'Pending', 'Processing', 'Completed', etc.
            createdAt: new Date(),
        };

        await orders.insertOne(orderData);

        res.status(200).json({ message: 'Order placed successfully! A confirmation email has been sent.', trackingId });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'There was an error processing your request.' });
    } finally {
        await client.close();
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
