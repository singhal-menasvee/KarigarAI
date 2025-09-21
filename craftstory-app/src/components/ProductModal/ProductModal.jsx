import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const ProductModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <Dialog
      open={!!product}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h2">
            {product.name}
          </Typography>
          <Button onClick={onClose} color="inherit">
            <CloseIcon />
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={product.image}
              alt={product.name}
              sx={{
                width: '100%',
                height: 300,
                objectFit: 'cover',
                borderRadius: 2,
                mb: 2
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" color="primary" gutterBottom>
                ₹{product.price.toLocaleString()}
              </Typography>
              <Chip
                label={product.category}
                color="primary"
                sx={{ mb: 2 }}
              />
            </Box>

            <Typography variant="h6" gutterBottom>
              Artisan Details
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Artisan:</strong> {product.artisan}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Location:</strong> {product.location}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1">
              {product.description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Product Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This handcrafted piece represents the rich tradition of Indian craftsmanship.
              Each item is carefully made by skilled artisans using traditional techniques
              passed down through generations.
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        <Button onClick={onClose} variant="contained" color="primary">
          Add to Cart
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductModal;
