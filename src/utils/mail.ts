import WebSocket from 'ws';
import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config()
const wss = new WebSocket.Server({ port: 8080 });

// Email configuration
const emailConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // or 'STARTTLS'
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
};

export const sendEmail = async (messageData:any) => {
    try {
        // Create a Nodemailer transporter
const transporter = nodemailer.createTransport(emailConfig);
 // Send the email
 const mailOptions = {
    from: "angajalavikashkumar@gmail.com",
    to: messageData.to,
    subject: messageData.subject,
    text: messageData.text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    return { success: false, message: 'Error sending email' };
    } else {
      return { success: true, message: 'Email sent successfully' };
    }
  });
wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);

   
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
    return true
    } catch (error) {
        console.error("Error occoured to send email", error);
        return error
    }
}
