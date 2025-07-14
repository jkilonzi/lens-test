const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Function to send OTP email
const sendOTPEmail = async (email, otp) => {
  try {
    await resend.emails.send({
      from: `Suilens <${process.env.EMAIL_USERNAME}>`, // Must be verified in Resend
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
              <span style="font-size: 32px; font-weight: bold; colorLA #4DA2FF; letter-spacing: 5px;">${otp}</span>
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
    });
    console.log(`OTP email sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send OTP email to ${email}:`, error);
    throw new Error('Error sending email');
  }
};

module.exports = { sendOTPEmail };
