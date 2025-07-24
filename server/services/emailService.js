const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// OAuth2 client setup
const { OAuth2 } = google.auth;
const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID, 
  process.env.GOOGLE_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground' // Redirect URL
);

// Set the refresh token
oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

// Create Nodemailer transporter
const createTransporter = async () => {
  try {
    const accessToken = await oauth2Client.getAccessToken();

    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USERNAME,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });
  } catch (error) {
    console.error('Error creating email transporter:', error);
    // Fallback to basic SMTP if OAuth fails
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
};

// Function to send OTP email
const sendOTPEmail = async (email, otp) => {
  const transporter = await createTransporter();

  const mailOptions = {
    from: `"Suilens" <${process.env.EMAIL_USERNAME}>`,
    to: email,
    subject: 'Your Suilens Login Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4DA2FF; margin: 0;">Suilens</h1>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
          <h2 style="color: #333; margin-bottom: 20px;">Your Login Code</h2>
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #4DA2FF; letter-spacing: 5px;">${otp}</span>
          </div>
          <p style="color: #666; margin: 20px 0;">This code will expire in 10 minutes.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
          <p>© 2025 Suilens. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `Your Suilens login code is: ${otp}. This code will expire in 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send OTP email to ${email}:`, error);
    throw new Error('Error sending email');
  }
};

// Function to send a recovery email (keeping existing functionality)
const sendRecoveryEmail = async (email, token) => {
  const transporter = await createTransporter();

  const mailOptions = {
    from: `"Suilens" <${process.env.EMAIL_USERNAME}>`,
    to: email,
    subject: 'Password Recovery',
    text: `To reset your password, use this token: ${token}`,
    html: `<p>To reset your password, use this token: <strong>${token}</strong></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Recovery email sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send recovery email to ${email}:`, error);
    throw new Error('Error sending email');
  }
};

// Function to send event registration email with QR code
const sendEmailWithQRCode = async (email, name, qrCodeDataUrl, checkInUrl) => {
  const transporter = await createTransporter();

  const mailOptions = {
    from: `"Suilens" <${process.env.EMAIL_USERNAME}>`,
    to: email,
    subject: 'Your Event Ticket and QR Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4DA2FF; margin: 0;">Suilens</h1>
        </div>
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${name},</h2>
          <p>Thank you for registering for the event. Please find your unique QR code ticket below:</p>
          <img src="${qrCodeDataUrl}" alt="Event QR Code" style="margin: 20px 0; max-width: 300px;" />
          <p>You can also use this link to check in: <a href="${checkInUrl}">${checkInUrl}</a></p>
          <p>Please present this QR code at the event for check-in.</p>
        </div>
        <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
          <p>© 2025 Suilens. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `Hello ${name},\n\nThank you for registering for the event. Your check-in link: ${checkInUrl}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Event registration email with QR code sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send event registration email to ${email}:`, error);
    throw new Error('Error sending event registration email');
  }
};

module.exports = { sendOTPEmail, sendRecoveryEmail, sendEmailWithQRCode };
