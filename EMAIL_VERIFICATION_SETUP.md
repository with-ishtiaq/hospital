# Email Verification Setup

This guide will help you set up the email verification feature for the OFTEN application.

## Backend Setup

1. **Environment Variables**
   Copy the `.env.example` file to `.env` and update the following variables:
   ```
   # Email Configuration
   EMAIL_SERVICE=gmail  # or your email service (e.g., 'outlook', 'hotmail')
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-specific-password  # Use app password for Gmail
   EMAIL_FROM=your-email@gmail.com
   
   # Verification Code
   VERIFICATION_CODE_EXPIRY_MINUTES=30  # Verification code expiry time in minutes
   VERIFICATION_RESEND_COOLDOWN=60  # Cooldown period in seconds
   ```

2. **Gmail App Password (for Gmail users)**
   If you're using Gmail, you'll need to generate an App Password:
   1. Go to your Google Account settings
   2. Navigate to Security
   3. Under "Signing in to Google," enable 2-Step Verification if not already enabled
   4. Go to App Passwords
   5. Generate a new app password for your application
   6. Use this password in the `EMAIL_PASS` variable

## Frontend Setup

The frontend is already configured to work with the backend. The following routes are available:

- `/verify-email` - Email verification page (requires email in location state)

## API Endpoints

### Send Verification Code
- **URL**: `POST /api/verification/send-code`
- **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Verification code sent to your email"
  }
  ```

### Verify Code
- **URL**: `POST /api/verification/verify`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "code": "12345"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Email verified successfully",
    "token": "jwt-token-here"
  }
  ```

### Resend Verification Code
- **URL**: `POST /api/verification/resend-code`
- **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Verification code resent to your email"
  }
  ```

## Testing

1. Start the backend server:
   ```bash
   cd backend
   npm install
   npm start
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. Navigate to the verification page with an email parameter:
   ```
   http://localhost:3000/verify-email
   ```
   (Make sure to navigate from the signup flow to set the email in the location state)

## Notes

- The verification codes are stored in memory and will be lost when the server restarts.
- In a production environment, consider using a persistent store like Redis for verification codes.
- Email templates can be customized in the `verificationController.js` file.
