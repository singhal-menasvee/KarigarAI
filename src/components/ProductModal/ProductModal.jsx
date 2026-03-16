import React, { useMemo, useState } from 'react';
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
import {
  Close as CloseIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';

const ProductModal = ({ product, onClose }) => {
  if (!product) return null;

  const images = useMemo(() => {
    const imgs = Array.isArray(product.images) ? product.images : [];
    if (imgs.length > 0) return imgs;
    if (product.image) return [product.image];
    return [];
  }, [product.images, product.image]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] || product.image;

  const canPrev = activeIndex > 0;
  const canNext = activeIndex < images.length - 1;

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
              sx={{
                position: 'relative',
                width: '100%',
                height: 360,
                borderRadius: 2,
                overflow: 'hidden',
                bgcolor: 'background.default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              {activeImage ? (
                <Box
                  component="img"
                  src={activeImage}
                  alt={product.name}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                    bgcolor: 'common.white',
                  }}
                />
              ) : (
                <Typography color="text.secondary">No image</Typography>
              )}

              {images.length > 1 && (
                <>
                  <Button
                    onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                    disabled={!canPrev}
                    sx={{
                      position: 'absolute',
                      left: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      minWidth: 0,
                      p: 1,
                      bgcolor: 'rgba(255,255,255,0.9)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
                    }}
                  >
                    <ChevronLeftIcon />
                  </Button>
                  <Button
                    onClick={() => setActiveIndex((i) => Math.min(images.length - 1, i + 1))}
                    disabled={!canNext}
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      minWidth: 0,
                      p: 1,
                      bgcolor: 'rgba(255,255,255,0.9)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
                    }}
                  >
                    <ChevronRightIcon />
                  </Button>
                </>
              )}
            </Box>

            {images.length > 1 && (
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  overflowX: 'auto',
                  pb: 1,
                }}
              >
                {images.map((src, idx) => (
                  <Box
                    key={`${src}-${idx}`}
                    component="button"
                    onClick={() => setActiveIndex(idx)}
                    style={{
                      border: idx === activeIndex ? '2px solid #1976d2' : '1px solid rgba(0,0,0,0.12)',
                      borderRadius: 8,
                      padding: 0,
                      background: 'transparent',
                      cursor: 'pointer',
                      flex: '0 0 auto',
                    }}
                  >
                    <Box
                      component="img"
                      src={src}
                      alt={`${product.name} ${idx + 1}`}
                      sx={{
                        width: 72,
                        height: 72,
                        objectFit: 'cover',
                        display: 'block',
                        borderRadius: 1,
                      }}
                    />
                  </Box>
                ))}
              </Box>
            )}
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
