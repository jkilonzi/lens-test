const crypto = require('crypto');
const { OTP } = require('../models/userSchema');
const { sendOTPEmail } = require('./emailService');

class OTPService {
  // Generate a 6-digit OTP
  generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
  }

  // Send OTP to email
  async sendOTP(email) {
    try {
      // Generate OTP
      const otp = this.generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

      // Delete any existing OTPs for this email
      await OTP.destroy({
        where: { email }
      });

      // Store OTP in database
      await OTP.create({
        email,
        otp,
        expiresAt,
      });

      // Send OTP via email
      await sendOTPEmail(email, otp);

      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw new Error('Failed to send OTP');
    }
  }

  // Verify OTP
  async verifyOTP(email, otp) {
    try {
      const otpRecord = await OTP.findOne({
        where: { 
          email,
          otp,
        }
      });

      if (!otpRecord) {
        return { success: false, message: 'Invalid OTP' };
      }

      // Check if OTP has expired
      if (new Date() > otpRecord.expiresAt) {
        // Delete expired OTP
        await OTP.destroy({ where: { id: otpRecord.id } });
        return { success: false, message: 'OTP has expired' };
      }

      // Delete used OTP
      await OTP.destroy({ where: { id: otpRecord.id } });

      return { success: true, message: 'OTP verified successfully' };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw new Error('Failed to verify OTP');
    }
  }

  // Clean up expired OTPs (can be called periodically)
  async cleanupExpiredOTPs() {
    try {
      await OTP.destroy({
        where: {
          expiresAt: {
            [require('sequelize').Op.lt]: new Date()
          }
        }
      });
    } catch (error) {
      console.error('Error cleaning up expired OTPs:', error);
    }
  }
}

module.exports = new OTPService();