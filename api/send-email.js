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
        const trackingId = crypto.randomBytes(8).toString('hex'); // Generate unique tracking ID

        // First email (to customer)
        const customerEmailBody = `
        <div style="font-family: Arial, sans-serif; color: #000; background-color: #fff; padding: 20px; max-width: 600px; margin: 0 auto;">
            <header style="border: 2px solid #135b3a; border-radius: 10px; padding: 10px; text-align: center;">
                <h2 style="color: #135b3a; margin: 0;">ORDER SUMMARY</h2>
                <h4 style="margin: 0;">Invoice</h4>
            </header>
            <div style="background-color: #f0b52e; border-radius: 10px; padding: 15px; margin-top: 15px;">
                <h3>Hello ${firstName} ${lastName},</h3>
                <p>Below is the summary of your order:<br />
                <strong>Tracking ID:</strong> ${trackingId}</p>
            </div>
            <div style="margin-top: 15px;">
                <b>Items:</b>
                <ul>${orderSummary}</ul>
                <p><strong>Total Price: ${totalPrice.toLocaleString()} NGN</strong></p>
                <p><strong>Referred By:</strong> ${referral || 'N/A'}</p>
            </div>
            <div style="margin-top: 15px;">
                <p>To complete your order, please make a payment of 
                <strong>${totalPrice.toLocaleString()} NGN</strong> to the account below:</p>
                <p style="font-size: 1.1em;">
                    <strong>NO:</strong> 2198210889 <br />
                    <strong>Name:</strong> George Chiemerie Chime <br />
                    <strong>Bank:</strong> United Bank of Africa (UBA)
                </p>
            </div>
            <p>We will contact you at: <strong>${phone}</strong>.</p>
            <p style="font-size: 0.9em; text-align: right;">Thank you for choosing us!</p>
            <footer style="background-color: #135b3a; color: #fff; padding: 10px; margin-top: 15px; text-align: center;">
                <p>Contact Us: <br />
                    Call - 08143904414 | Whatsapp - +2348143904414 | Email - georgewoodcasket@gmail.com <br />
                    Address - No. 2 Umudo Street, Okwojo Ngwo Enugu.
                </p>
                <p style="font-size: 0.8em;">&copy; 2024 George Wood Casket and Furniture. All Rights Reserved.</p>
            </footer>
        </div>
        `;

        // Second email (to georgechime91@icloud.com)
        const adminEmailBody = `
        <div style="font-family: Arial, sans-serif; color: #000; background-color: #fff; padding: 20px; max-width: 600px; margin: 0 auto;">
            <header style="border: 2px solid #135b3a; border-radius: 10px; padding: 10px; text-align: center;">
                <h2 style="color: #135b3a; margin: 0;">NEW ORDER</h2>
            </header>
            <div style="margin-top: 15px;">
                <p><strong>Customer Name:</strong> ${firstName} ${lastName}</p>
                <p><strong>Tracking ID:</strong> ${trackingId}</p>
                <p><strong>Items Ordered:</strong></p>
                <ul>${orderSummary}</ul>
                <p><strong>Total Price:</strong> ${totalPrice.toLocaleString()} NGN</p>
            </div>
        </div>
        `;

        // Nodemailer setup
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Send the first email to the customer
        const customerMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Order Confirmation',
            html: customerEmailBody // Send the HTML formatted email to customer
        };

        // Send the second email to the admin (georgechime91@icloud.com)
        const adminMailOptions = {
            from: process.env.EMAIL_USER,
            to: 'georgechime91@icloud.com',
            subject: 'New Order',
            html: adminEmailBody // Send the HTML formatted email to admin
        };

        // Send both emails
        await transporter.sendMail(customerMailOptions);
        await transporter.sendMail(adminMailOptions);

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
