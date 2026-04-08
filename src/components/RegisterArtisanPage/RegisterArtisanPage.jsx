import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  MenuItem,
  Snackbar,
  Alert,
  Divider,
} from '@mui/material';
import { useUser } from '@clerk/clerk-react';

const CRAFT_TYPES = [
  'pottery',
  'handloom',
  'wood carving',
  'jewelry',
  'paintings',
  'others',
];

const RegisterArtisanPage = ({ setCurrentPage }) => {
  const { user } = useUser();
  const defaultEmail = user?.primaryEmailAddress?.emailAddress || '';
  const defaultName = user?.fullName || '';

  const [formData, setFormData] = useState({
    name: defaultName,
    email: defaultEmail,
    phone: '',
    location: '',
    craftType: '',
    experienceYears: '',
    story: '',
    shopName: '',
    shopDescription: '',
    productCategories: '',
    monthlyProduction: '',
    upiId: '',
    accountNumber: '',
    ifscCode: '',
  });

  const [files, setFiles] = useState({
    artisanPhoto: null,
    workshopPhoto: null,
    sampleProducts: [],
  });

  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (name === 'sampleProducts') {
      setFiles((prev) => ({ ...prev, sampleProducts: Array.from(selectedFiles) }));
    } else {
      setFiles((prev) => ({ ...prev, [name]: selectedFiles[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      setSnackbar({ open: true, message: 'Email is required', severity: 'error' });
      return;
    }

    try {
      setSaving(true);
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (files.artisanPhoto) data.append('artisanPhoto', files.artisanPhoto);
      if (files.workshopPhoto) data.append('workshopPhoto', files.workshopPhoto);
      files.sampleProducts.forEach((file) => {
        data.append('sampleProducts', file);
      });

      const resp = await fetch('/api/artisan/register', {
        method: 'POST',
        body: data,
      });

      if (!resp.ok) {
        let msg = `Failed to register (${resp.status})`;
        try {
          const body = await resp.json();
          msg = body?.error?.message || body?.message || msg;
        } catch (_) {}
        throw new Error(msg);
      }

      setSnackbar({ open: true, message: 'Successfully registered as an artisan!', severity: 'success' });
      setTimeout(() => {
        setCurrentPage('dashboard');
      }, 2000);
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button variant="text" onClick={() => setCurrentPage('dashboard')} sx={{ mb: 2 }}>
        &larr; Back to Dashboard
      </Button>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Register as an Artisan
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Join our platform and connect with buyers looking for authentic handcrafted products.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Personal Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Full Name"
                fullWidth
                required
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="Email"
                type="email"
                fullWidth
                required
                value={formData.email}
                onChange={handleChange}
                disabled={!!defaultEmail}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="phone"
                label="Phone Number"
                fullWidth
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="location"
                label="Location / Address"
                fullWidth
                value={formData.location}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" gutterBottom>
            Artisan Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="craftType"
                label="Craft Type"
                select
                fullWidth
                value={formData.craftType}
                onChange={handleChange}
              >
                {CRAFT_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="experienceYears"
                label="Years of Experience"
                type="number"
                fullWidth
                value={formData.experienceYears}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="story"
                label="Short Story / Background"
                fullWidth
                multiline
                rows={3}
                value={formData.story}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" gutterBottom>
            Business Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="shopName"
                label="Shop Name"
                fullWidth
                value={formData.shopName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="monthlyProduction"
                label="Estimated Monthly Production"
                fullWidth
                value={formData.monthlyProduction}
                onChange={handleChange}
                placeholder="e.g. 50 items"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="productCategories"
                label="Product Categories (comma separated)"
                fullWidth
                value={formData.productCategories}
                onChange={handleChange}
                placeholder="e.g. Sarees, Kurtas, Dupattas"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="shopDescription"
                label="Shop Description"
                fullWidth
                multiline
                rows={3}
                value={formData.shopDescription}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" gutterBottom>
            Media (Optional)
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            You can add photos later from your dashboard.
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Artisan Photo
                <input type="file" hidden name="artisanPhoto" accept="image/*" onChange={handleFileChange} />
              </Button>
              {files.artisanPhoto && <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>{files.artisanPhoto.name}</Typography>}
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Workshop Photo
                <input type="file" hidden name="workshopPhoto" accept="image/*" onChange={handleFileChange} />
              </Button>
              {files.workshopPhoto && <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>{files.workshopPhoto.name}</Typography>}
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Sample Products
                <input type="file" hidden multiple name="sampleProducts" accept="image/*" onChange={handleFileChange} />
              </Button>
              {files.sampleProducts.length > 0 && (
                <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                  {files.sampleProducts.length} file(s) selected
                </Typography>
              )}
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" gutterBottom>
            Banking / Payments (Optional)
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                name="upiId"
                label="UPI ID"
                fullWidth
                value={formData.upiId}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="accountNumber"
                label="Bank Account Number"
                fullWidth
                value={formData.accountNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="ifscCode"
                label="IFSC Code"
                fullWidth
                value={formData.ifscCode}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 5, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" size="large" disabled={saving}>
              {saving ? 'Submitting...' : 'Submit Application'}
            </Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RegisterArtisanPage;
