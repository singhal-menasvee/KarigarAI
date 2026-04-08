import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Navigation from './components/Navigation/Navigation';
import Homepage from './components/Homepage/Homepage';
import StoryGenerator from './components/StoryGenerator/StoryGenerator';
import Marketplace from './components/Marketplace/Marketplace';
import Dashboard from './components/Dashboard/Dashboard';
import LoginPage from './components/LoginPage/LoginPage';
import ProductModal from './components/ProductModal/ProductModal';
import ChatModal from './components/ChatModal/ChatModal';
import Footer from './components/Footer/Footer';
import RegisterArtisanPage from './components/RegisterArtisanPage/RegisterArtisanPage';

import theme from './theme';
import { sampleData } from './utils/data';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  React.useEffect(() => {
    const handleNavigation = (e) => setCurrentPage(e.detail);
    window.addEventListener('navigate-to', handleNavigation);
    return () => window.removeEventListener('navigate-to', handleNavigation);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Homepage setCurrentPage={setCurrentPage} />;
      case 'shop':
        return <Marketplace setSelectedProduct={setSelectedProduct} />;
      case 'story':
        return <StoryGenerator />;
      case 'dashboard':
        return <Dashboard />;
      case 'login':
        return <LoginPage />;
      case 'signup':
        return <SignUpPage />;
      case 'register-artisan':
        return <RegisterArtisanPage setCurrentPage={setCurrentPage} />;
      default:
        return <Homepage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
        
        <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
          {renderPage()}
        </Box>
        
        <Footer />
        
        {/* Chat Button */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
        >
          <Box
            component="button"
            onClick={() => setIsChatOpen(true)}
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              color: 'white',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'primary.dark',
                transform: 'scale(1.1)',
              },
            }}
          >
            💬
          </Box>
        </Box>
        
        {/* Modals */}
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
        
        <ChatModal 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)} 
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;