const { OTP, User } = require('../models/userSchema');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Generate a 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
async function sendEmail(to, otp) {
  // Configure your email transport here (e.g., SMTP)
  const transporter = nodemailer.createTransport({
    // Example using Gmail SMTP
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
}

// Controller to send OTP
exports.sendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Generate OTP and expiration time (10 minutes)
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Save OTP to database, delete any existing OTP for this email
    await OTP.destroy({ where: { email } });
    await OTP.create({ email, otp: otpCode, expiresAt });

    // Send OTP email
    await sendEmail(email, otpCode);

    res.json({ message: 'OTP sent successfully', email });
  } catch (err) {
    next(err);
  }
};

// Controller to verify OTP
exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({ where: { email, otp } });
    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Check expiration
    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    // Find or create user by email
    let user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.create({ email });
    }

    // Delete OTP after successful verification
    await OTP.destroy({ where: { email } });

    // Return user info (simulate login)
    res.json({ message: 'OTP verified successfully', user });
  } catch (err) {
    next(err);
  }
};
