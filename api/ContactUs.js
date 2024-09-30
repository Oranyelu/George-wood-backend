import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Create the transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Contact Us API
app.post('/api/contact', (req, res) => {
  const { name, email, issue } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'georgechime91@icloud.com',
    subject: `New Issue Reported by ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nIssue:\n${issue}`,
  };

  transporter.sendMail(mailOptions)
    .then(() => {
      res.status(200).send({ message: 'Email sent successfully' });
    })
    .catch(error => {
      res.status(500).send({ message: 'Error sending email', error });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
