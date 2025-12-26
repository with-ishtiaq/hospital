const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

// In-memory store for verification codes (in production, use Redis or database)
const verificationCodes = new Map();

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const VERIFICATION_CODE_EXPIRY_MINUTES = parseInt(process.env.VERIFICATION_CODE_EXPIRY_MINUTES) || 30;
const VERIFICATION_RESEND_COOLDOWN = parseInt(process.env.VERIFICATION_RESEND_COOLDOWN) || 60;

// Generate a random 5-digit code
const generateVerificationCode = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

// Send verification email
const sendVerificationEmail = async (email, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email - OFTEN',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2e7d32; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">OFTEN</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2>Email Verification</h2>
          <p>Thank you for signing up! Please use the following verification code to complete your registration:</p>
          <div style="background-color: #e8f5e9; padding: 15px; text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
            ${code}
          </div>
          <p>This code will expire in 30 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
        <div style="background-color: #f0f8f0; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          <p>© ${new Date().getFullYear()} OFTEN. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send verification code
const sendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Check if user exists (you might want to check if email is already registered)
    // const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    // if (user.rows.length > 0) {
    //   return res.status(400).json({ success: false, message: 'Email already registered' });
    // }

    // Generate and store verification code
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + VERIFICATION_CODE_EXPIRY_MINUTES * 60 * 1000);
    
    verificationCodes.set(email, {
      code,
      expiresAt,
      verified: false,
      sentAt: new Date(),
    });

    // Send verification email
    await sendVerificationEmail(email, code);

    res.status(200).json({
      success: true,
      message: 'Verification code sent to your email',
      // In production, don't send the code in the response
      // code: process.env.NODE_ENV === 'development' ? code : undefined,
    });
  } catch (error) {
    console.error('Error sending verification code:', error);
    res.status(500).json({ success: false, message: 'Failed to send verification code' });
  }
};

// Verify code
const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    
    if (!email || !code) {
      return res.status(400).json({ success: false, message: 'Email and code are required' });
    }

    const verification = verificationCodes.get(email);
    
    if (!verification) {
      return res.status(400).json({ success: false, message: 'No verification code found for this email' });
    }

    if (verification.expiresAt < new Date()) {
      verificationCodes.delete(email);
      return res.status(400).json({ success: false, message: 'Verification code has expired' });
    }

    if (verification.code !== code) {
      return res.status(400).json({ success: false, message: 'Invalid verification code' });
    }

    // Mark as verified
    verification.verified = true;
    verification.expiresAt = new Date(Date.now() + VERIFICATION_CODE_EXPIRY_MINUTES * 60 * 1000);
    
    // In production, you would update the user's email_verified status in the database here
    // await db.query('UPDATE users SET email_verified = true WHERE email = $1', [email]);

    res.status(200).json({ 
      success: true, 
      message: 'Email verified successfully',
      token: uuidv4(), // In production, generate a JWT token
    });
  } catch (error) {
    console.error('Error verifying code:', error);
    res.status(500).json({ success: false, message: 'Failed to verify code' });
  }
};

// Resend verification code
const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Check if there's an existing verification
    const existingVerification = verificationCodes.get(email);
    
    if (existingVerification) {
      const now = new Date();
      const lastSent = existingVerification.sentAt || 0;
      const timeSinceLastSent = (now - lastSent) / 1000; // in seconds
      
      // Prevent resending too frequently
      if (timeSinceLastSent < VERIFICATION_RESEND_COOLDOWN) {
        return res.status(429).json({
          success: false,
          message: `Please wait ${Math.ceil(VERIFICATION_RESEND_COOLDOWN - timeSinceLastSent)} seconds before requesting a new code`,
        });
      }
    }

    // Generate and store new verification code
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + VERIFICATION_CODE_EXPIRY_MINUTES * 60 * 1000);
    
    verificationCodes.set(email, {
      code,
      expiresAt,
      verified: false,
      sentAt: new Date(),
    });

    // Send verification email
    await sendVerificationEmail(email, code);

    res.status(200).json({
      success: true,
      message: 'Verification code resent to your email',
    });
  } catch (error) {
    console.error('Error resending verification code:', error);
    res.status(500).json({ success: false, message: 'Failed to resend verification code' });
  }
};

module.exports = {
  sendVerificationCode,
  verifyCode,
  resendVerificationCode,
};
