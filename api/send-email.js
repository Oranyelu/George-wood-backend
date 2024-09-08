import express from 'express';
import cors from 'cors';
import { createTransport } from 'nodemailer';

const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

app.post('/api/send-email', async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Method Not Allowed' });
  }

  const { firstName, lastName, email, phone, cart, referral } = req.body;

  if (!firstName || !lastName || !email || !phone || !cart || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).send({ message: 'Missing or invalid fields' });
  }

  const name = `${firstName} ${lastName}`;
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

  let transporter = createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let mailOptions = {
    from: '"George Wood Casket and Furniture" <georgewoodcasketemail@gmail.com>',
    to: email,
    subject: 'Order Confirmation',
    text: emailBody,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'Email sent successfully', info });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send({ message: 'Error sending email', error });
  }
});

export default app;
