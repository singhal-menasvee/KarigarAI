import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Box, Container, Typography, Paper } from '@mui/material';

const LoginPage = () => {
  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            CraftStory
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Sign in to access your artisan dashboard
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <SignIn 
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              appearance={{
                elements: {
                  rootBox: {
                    width: '100%',
                    maxWidth: '400px'
                  },
                  card: {
                    boxShadow: 'none',
                    width: '100%'
                  }
                }
              }}
            />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;