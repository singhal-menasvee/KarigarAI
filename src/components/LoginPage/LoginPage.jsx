import React, { useState } from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Box, Container, Typography, Paper, Button, TextField, Alert } from '@mui/material';

const HAS_CLERK = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

const LoginPage = ({ setCurrentPage }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoggedIn(true);
  };

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
            KarigarAI
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Sign in to access your artisan dashboard
          </Typography>

          {HAS_CLERK ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <SignIn
                routing="virtual"
                signUpUrl="/sign-up"
                appearance={{
                  elements: {
                    rootBox: {
                      width: '100%',
                      maxWidth: '400px',
                    },
                    card: {
                      boxShadow: 'none',
                      width: '100%',
                    },
                  },
                }}
              />
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              {loggedIn && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Logged in successfully! Welcome back.
                </Alert>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Log In
              </Button>
            </Box>
          )}

          {setCurrentPage && (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button color="primary" onClick={() => setCurrentPage('signup')}>
                Don't have an account? Sign Up
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;