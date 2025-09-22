import React from 'react';
import heroBackground from '../../assets/images/4.jpg';

import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
} from '@mui/material';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/clerk-react';

const Homepage = ({ setCurrentPage }) => {
  const { user } = useUser();
  const stats = [
    { number: '21+', label: 'States' },
    { number: '2000+', label: 'Artisans' },
    { number: '50+', label: 'Crafts' },
    { number: '₹5L+', label: 'Earnings Generated' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper
  sx={{
    backgroundImage: `url(${heroBackground})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    py: 10,
    mb: 6,
    textAlign: 'center',
    
  }}
>

        <Container maxWidth="md">
          <Typography variant="h4" color="primary" gutterBottom>
            Embrace the spirit of India
          </Typography>
          <Typography variant="h2" component="h1" gutterBottom>
            Empowering Artisans, Preserving Heritage
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            Connect with authentic Indian craftsmanship. Every purchase supports local artisans and 
            helps preserve centuries-old traditions for future generations.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => setCurrentPage('shop')}
            >
              Explore Marketplace
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => setCurrentPage('story')}
            >
              Create Your Story
            </Button>
          </Box>

          {/* Login Button for signed out users */}
          <SignedOut>
            <Box sx={{ mt: 2 }}>
              <SignInButton mode="modal">
                <Button variant="contained" color="secondary" size="large">
                  Sign In / Register
                </Button>
              </SignInButton>
            </Box>
          </SignedOut>

          {/* Dashboard button for signed in users */}
          <SignedIn>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={() => setCurrentPage('dashboard')}
              >
                Go to Dashboard
              </Button>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Welcome back, {user?.firstName || user?.username}!
              </Typography>
            </Box>
          </SignedIn>
        </Container>
      </Paper>

      <Container>
        {/* Stats Section */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" color="primary" gutterBottom>
                    {stat.number}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Mission Section */}
        <Card sx={{ maxWidth: 800, mx: 'auto' }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h4" gutterBottom>
              Our Mission
            </Typography>
            <Typography variant="body1" color="text.secondary">
              We bridge the gap between traditional craftsmanship and modern commerce, using AI to help 
              artisans tell their stories and reach global markets while preserving India's rich cultural heritage.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Homepage;