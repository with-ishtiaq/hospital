import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const UnauthorizedView = () => {
  const location = useLocation();
  const message = location.state?.message || 'You do not have permission to access this page.';

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box textAlign="center">
        <Typography variant="h4" gutterBottom>Unauthorized</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {message}
        </Typography>
        <Button variant="contained" component={Link} to="/login">Go to Login</Button>
      </Box>
    </Container>
  );
};

export default UnauthorizedView;
