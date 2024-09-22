import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/send-email', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, cart, referral } = req.body;

        if (!firstName || !lastName || !email || !phone || !cart) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const orderSummary = cart.map(item => `<li>${item.name} - ${item.price.toLocaleString()} NGN</li>`).join("");
        const totalPrice = cart.reduce((total, item) => total + item.price, 0);
        const trackingId = crypto.randomBytes(8).toString('hex'); // Generate unique ID

        // Styled HTML email body
        const emailBody = `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #004b8d;">Hello ${firstName} ${lastName},</h2>
            <p>Thank you for your order! Here is a summary of your order:</p>
            <ul style="padding-left: 20px;">
                ${orderSummary}
            </ul>
            <p><strong>Total Price: ${totalPrice.toLocaleString()} NGN</strong></p>
            <p><strong>Referred By:</strong> ${referral || 'N/A'}</p>
            <hr style="border: 1px solid #ccc;" />
            <p>
              To complete your order, please make a payment of 
              <strong>${totalPrice.toLocaleString()} NGN</strong> 
              to the account below:
            </p>
            <p style="font-size: 1.1em;">
                George Chiemerie Chime <br>
                2198210889 <br>
                United Bank of Africa (UBA)
            </p>
            <p style="margin-top: 20px;">
              Here is your <strong>tracking ID</strong> to track the progress of your order: 
              <span style="background-color: #f0f0f0; padding: 5px;">${trackingId}</span>
            </p>
            <p>We will contact you at <strong>${phone}</strong>.</p>
            <p style="color: #888; font-size: 0.9em;">
              Thank you for choosing us!
            </p>
        </div>
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
            html: emailBody // Send the HTML formatted email
        };

        // Send the confirmation email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Order placed successfully! A confirmation email has been sent.', trackingId });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'There was an error processing your request.' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
