import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

interface Options {
  email: string;
  subject: string;
  html: string;
}

const sendOtpToEMail = async (options: Options) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"GameSphere" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
  } catch (err:any) {
    console.error('Error while sending email:', err);
    throw new Error('Failed to send email: ' + err.message);
  }
};

export default sendOtpToEMail;