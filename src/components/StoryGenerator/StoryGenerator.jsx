import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  IconButton,
  Alert,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { aiService } from '../../services/aiService';

const StoryGenerator = () => {
  const [formData, setFormData] = useState({
    artisanName: '',
    craftType: '',
    location: '',
    materials: '',
    techniques: '',
    inspiration: '',
    experience: '',
    productType: ''
  });
  const [generatedStory, setGeneratedStory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState('en');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateStory = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setCopied(false);

    // Call AI Service
    const story = await aiService.generateStory(formData, language);
    setGeneratedStory(story);
    setIsGenerating(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedStory);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          AI Story Generator
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Transform your craft details into compelling stories that connect with customers
        </Typography>
        <FormControl size="small" variant="outlined" sx={{ mt: 2, minWidth: 120 }}>
          <InputLabel>Language</InputLabel>
          <Select
            value={language}
            label="Language"
            onChange={(e) => setLanguage(e.target.value)}
          >
            <MenuItem value="en">English (US)</MenuItem>
            <MenuItem value="hi">Hindi (हिंदी)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Paper sx={{ p: 4, mb: 4 }}>
        <form onSubmit={generateStory}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Artisan Name"
                name="artisanName"
                value={formData.artisanName}
                onChange={handleInputChange}
                placeholder="Your name"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth

                label="Craft Type"
                name="craftType"
                value={formData.craftType}
                onChange={handleInputChange}
                SelectProps={{ native: true }}
              >
                <option value="">Select craft type</option>
                <option value="Blue Pottery">Blue Pottery</option>
                <option value="Bandhani Textiles">Bandhani Textiles</option>
                <option value="Brass Work">Brass Work</option>
                <option value="Wood Carving">Wood Carving</option>
                <option value="Madhubani Art">Madhubani Art</option>
                <option value="Pashmina Weaving">Pashmina Weaving</option>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="City, State"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Experience (years)"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="Years of experience"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Materials Used"
                name="materials"
                value={formData.materials}
                onChange={handleInputChange}
                placeholder="Clay, silk, brass, etc."
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Product Type"
                name="productType"
                value={formData.productType}
                onChange={handleInputChange}
                placeholder="Vase, scarf, plate, etc."
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Techniques"
                name="techniques"
                value={formData.techniques}
                onChange={handleInputChange}
                placeholder="Hand-painting, tie-dye, engraving, etc."
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Inspiration"
                name="inspiration"
                value={formData.inspiration}
                onChange={handleInputChange}
                placeholder="What inspires your work? Family traditions, nature, culture..."
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={isGenerating}
            sx={{ mt: 3 }}
          >
            {isGenerating ? (language === 'hi' ? 'कहानी बना रहा हूँ...' : 'Generating Story...') : (language === 'hi' ? 'कहानी बनाएं' : 'Generate AI Story')}
          </Button>
        </form>
      </Paper>

      {generatedStory && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">Your Generated Story</Typography>
              <IconButton onClick={copyToClipboard} color="primary">
                <ContentCopyIcon />
              </IconButton>
            </Box>
            {copied && <Alert severity="success" sx={{ mb: 2 }}>Story copied to clipboard!</Alert>}
            <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
              {generatedStory}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default StoryGenerator;