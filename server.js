import express from 'express';
import cors from 'cors';
import { createTransport } from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // This was missing

// Email Route
app.post('/send-email', async (req, res) => {
  const { name, email, phone, cart, referral } = req.body;

  // Create order summary
  const orderSummary = cart.map(item => `${item.name} - ${item.price.toLocaleString()} NGN`).join('\n');
  const emailBody = `
    Hello ${name},

    Thank you for your order. Here is the summary of your purchase:

    ${orderSummary}

    Referral: ${referral}

    We will contact you shortly to confirm your order.

    Best regards,
    George Wood Casket and Furniture
  `;

  // Create a transporter object using SMTP transport
  let transporter = createTransport({
    service: 'gmail', // Use your email service provider
    auth: {
      user: process.env.EMAIL_USER, // Replace with your email
      pass: process.env.EMAIL_PASS, // Replace with your email password or app password
    },
  });

  // Setup email data
  let mailOptions = {
    from: '"George Wood Casket and Furniture" <georgewoodcasketemail@gmail.com>', // Sender address
    to: email, // Receiver's email
    subject: 'Order Confirmation',
    text: emailBody, // Plain text body
  };

  // Send mail with defined transport object
  try {
    let info = await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'Email sent successfully', info });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send({ message: 'Error sending email', error });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
