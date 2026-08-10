import React, { useState } from 'react';
import { SignUp } from '@clerk/clerk-react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  Alert,
  Grid,
  Chip,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Vite static image imports
import customerImg from '../../assets/images/customerIMG.jpg';
import artisanImg from '../../assets/images/rohit-sharma-v7g4Lba0NDo-unsplash.jpg';

const HAS_CLERK = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

const SignUpPage = ({ setCurrentPage }) => {
  const [activeRole, setActiveRole] = useState('buyer'); // 'buyer' (Customer) or 'artisan'
  const [step, setStep] = useState(1); // 1: Role Selection, 2: Signup Form
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [signedUp, setSignedUp] = useState(false);

  const handleRoleClick = (role) => {
    setActiveRole(role);
    sessionStorage.setItem('selected_signup_role', role);
  };

  const handleContinue = () => {
    sessionStorage.setItem('selected_signup_role', activeRole);
    setStep(2);
  };

  const handleBackToRoleSelection = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignedUp(true);

    try {
      await fetch('/api/profile/bootstrap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.name,
          email: formData.email,
          role: activeRole || 'buyer',
        }),
      });
    } catch (err) {
      console.error('Fallback profile creation error:', err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#FAF3E0', // KarigarAI warm parchment background
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Paper
        elevation={4}
        sx={{
          maxWidth: '1100px',
          width: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#FFF8F0', // KarigarAI paper theme
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(210, 180, 140, 0.4)',
        }}
      >
        <Grid container alignItems="stretch" sx={{ width: '100%', minHeight: { xs: 'auto', md: '560px' } }}>
          {/* ========================================================= */}
          {/* LEFT COLUMN: SIGNUP & ROLE SELECTION CONTENT (~50%)        */}
          {/* ========================================================= */}
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              p: { xs: 3, sm: 4, md: 4.5 },
            }}
          >
            {/* BRAND LOGO */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 3 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  backgroundColor: '#8B4513',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  fontFamily: "'Raleway', sans-serif",
                }}
              >
                K
              </Box>
              <Typography variant="h6" fontWeight="bold" color="#8B4513" sx={{ fontFamily: "'Raleway', sans-serif" }}>
                KarigarAI
              </Typography>
            </Box>

            {step === 1 ? (
              /* STEP 1: ROLE SELECTION CONTENT */
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h4" fontWeight="bold" color="#2F2F2F" sx={{ fontFamily: "'Raleway', sans-serif", mb: 0.5 }}>
                  Who’s joining today?
                </Typography>
                <Typography variant="body2" color="#5A4632" sx={{ fontFamily: "'Roboto Slab', serif", mb: 3 }}>
                  Choose the option that best describes you.
                </Typography>

                {/* COMPACT HORIZONTAL ROLE CARDS */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75, mb: 3 }}>
                  {/* CUSTOMER CARD */}
                  <Box
                    onClick={() => handleRoleClick('buyer')}
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      border: '2px solid',
                      borderColor: activeRole === 'buyer' ? '#8B4513' : '#E0E0E0',
                      backgroundColor: activeRole === 'buyer' ? '#FAF3E0' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        borderColor: '#8B4513',
                        boxShadow: '0 4px 12px rgba(139, 69, 19, 0.1)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        minWidth: 42,
                        borderRadius: '10px',
                        backgroundColor: activeRole === 'buyer' ? '#8B4513' : '#FAF3E0',
                        color: activeRole === 'buyer' ? '#ffffff' : '#8B4513',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PersonOutlineIcon />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold" color="#2F2F2F" sx={{ fontFamily: "'Raleway', sans-serif", lineHeight: 1.2 }}>
                        I’m a Customer
                      </Typography>
                      <Typography variant="body2" color="#5A4632" sx={{ fontFamily: "'Roboto Slab', serif", fontSize: '0.825rem', mt: 0.3 }}>
                        Discover beautiful handmade products from talented artisans.
                      </Typography>
                    </Box>
                  </Box>

                  {/* ARTISAN CARD */}
                  <Box
                    onClick={() => handleRoleClick('artisan')}
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      border: '2px solid',
                      borderColor: activeRole === 'artisan' ? '#8B4513' : '#E0E0E0',
                      backgroundColor: activeRole === 'artisan' ? '#FAF3E0' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        borderColor: '#8B4513',
                        boxShadow: '0 4px 12px rgba(139, 69, 19, 0.1)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        minWidth: 42,
                        borderRadius: '10px',
                        backgroundColor: activeRole === 'artisan' ? '#8B4513' : '#FAF3E0',
                        color: activeRole === 'artisan' ? '#ffffff' : '#8B4513',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <StorefrontOutlinedIcon />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold" color="#2F2F2F" sx={{ fontFamily: "'Raleway', sans-serif", lineHeight: 1.2 }}>
                        I’m an Artisan
                      </Typography>
                      <Typography variant="body2" color="#5A4632" sx={{ fontFamily: "'Roboto Slab', serif", fontSize: '0.825rem', mt: 0.3 }}>
                        Showcase your craft, manage your products and connect with customers.
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* CONTINUE BUTTON */}
                <Button
                  onClick={handleContinue}
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    backgroundColor: '#8B4513',
                    color: '#ffffff',
                    py: 1.3,
                    borderRadius: '24px',
                    fontFamily: "'Raleway', sans-serif",
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#5C3317',
                    },
                  }}
                >
                  Continue
                </Button>

                {/* LOGIN LINK */}
                {setCurrentPage && (
                  <Box sx={{ textAlign: 'center', mt: 2.5 }}>
                    <Typography variant="body2" color="#5A4632" sx={{ fontFamily: "'Roboto Slab', serif" }}>
                      Already have an account?{' '}
                      <Button
                        color="primary"
                        onClick={() => setCurrentPage('login')}
                        sx={{
                          textTransform: 'none',
                          color: '#8B4513',
                          fontFamily: "'Raleway', sans-serif",
                          fontWeight: 600,
                          p: 0,
                          minWidth: 'auto',
                          '&:hover': { background: 'none', textDecoration: 'underline' },
                        }}
                      >
                        Log in
                      </Button>
                    </Typography>
                  </Box>
                )}
              </Box>
            ) : (
              /* STEP 2: SIGNUP FORM SCREEN WITH BACK BUTTON */
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBackToRoleSelection}
                    size="small"
                    sx={{ textTransform: 'none', color: '#8B4513', fontFamily: "'Raleway', sans-serif", fontWeight: 600 }}
                  >
                    Change Role
                  </Button>
                  <Chip
                    label={activeRole === 'artisan' ? 'Artisan Account' : 'Customer Account'}
                    sx={{
                      backgroundColor: '#FAF3E0',
                      color: '#8B4513',
                      fontWeight: 'bold',
                      fontFamily: "'Raleway', sans-serif",
                      borderRadius: '8px',
                      border: '1px solid #D2B48C',
                    }}
                  />
                </Box>

                <Typography variant="h4" fontWeight="bold" gutterBottom color="#2F2F2F" sx={{ fontFamily: "'Raleway', sans-serif" }}>
                  Create Your Account
                </Typography>
                <Typography variant="body2" color="#5A4632" sx={{ fontFamily: "'Roboto Slab', serif", mb: 2 }}>
                  Sign up as {activeRole === 'artisan' ? 'an Artisan' : 'a Customer'} to get started.
                </Typography>

                {HAS_CLERK ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <SignUp
                      routing="virtual"
                      signInUrl="/sign-in"
                      appearance={{
                        elements: {
                          rootBox: {
                            width: '100%',
                            maxWidth: '380px',
                          },
                          card: {
                            boxShadow: 'none',
                            width: '100%',
                            backgroundColor: 'transparent',
                          },
                        },
                      }}
                    />
                  </Box>
                ) : (
                  <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    {signedUp && (
                      <Alert severity="success" sx={{ mb: 2 }}>
                        Account created successfully as {activeRole === 'artisan' ? 'an Artisan' : 'a Customer'}! Welcome to KarigarAI.
                      </Alert>
                    )}
                    <TextField
                      margin="dense"
                      required
                      fullWidth
                      label="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <TextField
                      margin="dense"
                      required
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <TextField
                      margin="dense"
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
                      sx={{
                        mt: 2.5,
                        mb: 1.5,
                        py: 1.2,
                        fontFamily: "'Raleway', sans-serif",
                        fontWeight: 600,
                        borderRadius: '24px',
                        backgroundColor: '#8B4513',
                        '&:hover': { backgroundColor: '#5C3317' },
                      }}
                    >
                      Sign Up as {activeRole === 'artisan' ? 'Artisan' : 'Customer'}
                    </Button>
                  </Box>
                )}

                {setCurrentPage && (
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Typography variant="body2" color="#5A4632" sx={{ fontFamily: "'Roboto Slab', serif" }}>
                      Already have an account?{' '}
                      <Button
                        color="primary"
                        onClick={() => setCurrentPage('login')}
                        sx={{
                          textTransform: 'none',
                          color: '#8B4513',
                          fontFamily: "'Raleway', sans-serif",
                          fontWeight: 600,
                          p: 0,
                          minWidth: 'auto',
                          '&:hover': { background: 'none', textDecoration: 'underline' },
                        }}
                      >
                        Log in
                      </Button>
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Grid>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: FIT SIDE-BY-SIDE COVER IMAGE WITH OVERLAY   */}
          {/* ========================================================= */}
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              display: { xs: 'none', md: 'block' },
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: '#5C3317', // Dark brown fallback color
              minHeight: { xs: 350, md: '560px' },
            }}
          >
            {/* CUSTOMER HERO COVER IMAGE */}
            {activeRole === 'buyer' && (
              <img
                id="customer-hero-img"
                src={customerImg}
                alt="Customer Onboarding"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: 1,
                }}
              />
            )}

            {/* ARTISAN HERO COVER IMAGE */}
            {activeRole === 'artisan' && (
              <img
                id="artisan-hero-img"
                src={artisanImg}
                alt="Artisan Onboarding"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: 1,
                }}
              />
            )}

            {/* GRADIENT OVERLAY FOR READABILITY */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to top, rgba(47, 47, 47, 0.92) 0%, rgba(47, 47, 47, 0.45) 55%, rgba(92, 51, 23, 0.2) 100%)',
                zIndex: 2,
              }}
            />

            {/* OVERLAY TEXT ON TOP OF IMAGE */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 3,
                p: { md: 4, lg: 5 },
                color: '#ffffff',
              }}
            >
              {activeRole === 'buyer' ? (
                <>
                  <Typography variant="h3" fontWeight="bold" sx={{ fontFamily: "'Raleway', sans-serif", mb: 1, textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
                    Discover Indian Heritage
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: "'Roboto Slab', serif", color: '#f6dac2af', fontSize: '0.9rem', textShadow: '0 1px 4px rgba(0,0,0,0)', mb: 2}}>
                    Shop authentic, handcrafted treasures directly from master artisans across India.
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="h3" fontWeight="bold" sx={{ fontFamily: "'Raleway', sans-serif", mb: 1, textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
                    Empowering Handcrafters
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: "'Roboto Slab', serif", color: '#f6dac2af', fontSize: '0.9rem', textShadow: '0 1px 4px rgba(0, 0, 0, 0)', mb: 2}}>
                    Showcase your traditional skills, expand your business, and reach buyers worldwide.
                  </Typography>
                </>
              )}

              {/* Pagination Dots */}
              <Box sx={{ display: 'flex', gap: 1, mt: 2.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#D2691E' }} />
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.4)' }} />
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.4)' }} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default SignUpPage;