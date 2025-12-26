const axios = require('axios');

const verifyCaptcha = async (req, res, next) => {
  const { recaptchaToken } = req.body;

  // Check if recaptchaToken is provided
  if (!recaptchaToken) {
    return res.status(400).json({ error: 'reCAPTCHA token is required.' });
  }

  // Validate secret key from environment variables
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    return res.status(500).json({ error: 'reCAPTCHA secret key is not configured.' });
  }

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret,
          response: recaptchaToken,
        },
      }
    );

    const data = response.data;

    // Check reCAPTCHA response
    if (!data.success) {
      console.log(`reCAPTCHA verification failed: ${JSON.stringify(data)}`);
      return res.status(400).json({ error: 'Failed reCAPTCHA verification.' });
    }

    // Handle reCAPTCHA v3 score (optional, only if using v3)
    if (typeof data.score === 'number' && data.score < 0.5) {
      console.log(`Suspicious reCAPTCHA score: ${data.score}`);
      return res.status(400).json({ error: 'Failed reCAPTCHA verification due to low score.' });
    }

    next();
  } catch (err) {
    console.error('reCAPTCHA verification failed:', err.message);
    return res.status(500).json({ error: 'Failed to verify reCAPTCHA. Please try again later.' });
  }
};

module.exports = verifyCaptcha;