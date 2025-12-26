import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Container, Typography, TextField, Snackbar, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

const EmailVerification = () => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '']);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from location state or redirect to signup
  const email = location.state?.email;
  
  useEffect(() => {
    if (!email) {
      navigate('/signup', { state: { error: 'Please sign up first' } });
      return;
    }
    
    // Start the resend cooldown timer
    const timer = resendCooldown > 0 && setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [resendCooldown, email, navigate]);
  
  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCodeChange = (e, index) => {
    const value = e.target.value;
    
    // Only allow numbers and limit to one character
    if (value !== '' && !/^[0-9]$/.test(value)) {
      return;
    }

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value !== '' && index < 4) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === 'Backspace' && verificationCode[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = verificationCode.join('');
    
    if (code.length !== 5) {
      showSnackbar('Please enter a valid 5-digit code', 'error');
      return;
    }
    
    try {
      setIsVerifying(true);
      const response = await axios.post('/api/verification/verify', {
        email,
        code,
      });
      
      if (response.data.success) {
        showSnackbar('Email verified successfully!', 'success');
        // Redirect to dashboard or next step
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        showSnackbar(response.data.message || 'Verification failed', 'error');
      }
    } catch (error) {
      console.error('Verification error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to verify code. Please try again.';
      showSnackbar(errorMessage, 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (isResending || resendCooldown > 0) return;
    
    try {
      setIsResending(true);
      
      const response = await axios.post('/api/verification/resend-code', {
        email,
      });
      
      if (response.data.success) {
        setResendCooldown(60);
        showSnackbar('Verification code resent successfully!', 'success');
      } else {
        showSnackbar(response.data.message || 'Failed to resend code', 'error');
      }
    } catch (error) {
      console.error('Error resending code:', error);
      const errorMessage = error.response?.data?.message || 'Failed to resend verification code';
      showSnackbar(errorMessage, 'error');
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return null; // or a loading spinner
  }
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f0f8f0',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: '#2e7d32',
          color: 'white',
          py: 2,
          px: 2,
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Button
          onClick={() => navigate(-1)}
          sx={{ color: 'white', minWidth: 'auto', p: 1, mr: 1 }}
        >
          <ArrowBackIcon />
        </Button>
        <Typography variant="h6" component="h1">
          Sign up
        </Typography>
      </Box>

      <Container maxWidth="sm" sx={{ mt: 8, flex: 1 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            p: 4,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Typography variant="h5" component="h2" align="center" sx={{ mb: 3, color: '#2e7d32' }}>
            Check your email
          </Typography>
          
          <Typography variant="body1" align="center" sx={{ mb: 4, color: 'text.secondary' }}>
            Kindly input the five digit code sent to your email.
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
            {verificationCode.map((digit, index) => (
              <TextField
                key={index}
                inputRef={(el) => (inputRefs.current[index] = el)}
                value={digit}
                onChange={(e) => handleCodeChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                inputProps={{
                  maxLength: 1,
                  style: {
                    textAlign: 'center',
                    fontSize: '1.5rem',
                    padding: '8px',
                  },
                }}
                sx={{
                  width: '56px',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderRadius: '8px',
                      borderColor: '#e0e0e0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#2e7d32',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2e7d32',
                      borderWidth: '2px',
                    },
                  },
                }}
              />
            ))}
          </Box>

          <Button
            fullWidth
            variant="contained"
            type="submit"
            size="large"
            disabled={isVerifying || verificationCode.some(digit => !digit) || verificationCode.length !== 5}
            sx={{
              backgroundColor: '#2e7d32',
              '&:hover': { backgroundColor: '#1b5e20' },
              '&:disabled': {
                backgroundColor: '#a5d6a7',
                color: 'rgba(0, 0, 0, 0.26)',
              },
              py: 1.5,
              mb: 2,
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >
            {isVerifying ? 'Verifying...' : 'Verify Email'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Haven't got the email yet?{' '}
              <Button
                onClick={handleResendCode}
                disabled={isResending || resendCooldown > 0}
                sx={{
                  textTransform: 'none',
                  color: '#2e7d32',
                  p: 0,
                  minWidth: 'auto',
                  '&:hover': {
                    textDecoration: 'underline',
                    backgroundColor: 'transparent',
                  },
                  '&.Mui-disabled': {
                    color: 'text.disabled',
                  },
                }}
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend email'}
              </Button>
            </Typography>
          </Box>
        </Box>
      </Container>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmailVerification;
