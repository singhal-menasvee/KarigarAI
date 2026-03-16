import React, { useEffect, useMemo, useState } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Box,
  Chip,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Rating
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const Marketplace = ({ setSelectedProduct }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = ["All", "Pottery", "Textiles", "Metalwork", "Woodwork", "Jewelry"];

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        setError("");
        const resp = await fetch("/api/products");
        if (!resp.ok) throw new Error(`Failed to load products (${resp.status})`);
        const data = await resp.json();
        if (!isMounted) return;
        setProducts(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!isMounted) return;
        setError(e?.message || "Failed to load products");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  const uiProducts = useMemo(() => {
    return products.map((p) => ({
      id: p._id,
      name: p.title,
      artisan: p.artisanName,
      location: p.location,
      price: p.price,
      description: p.description,
      images: Array.isArray(p.images) ? p.images : [],
      image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : "/api/placeholder/300/300",
      category: p.category,
      rating: p.rating || 4,
      raw: p
    }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return uiProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.artisan.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "" || selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [uiProducts, searchTerm, selectedCategory]);

  return (
    <Box sx={{ width: "100%", px: 4, boxSizing: "border-box" }}>

      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h3" fontWeight="bold">
          Artisan Marketplace
        </Typography>
        <Typography color="text.secondary">
          Discover handcrafted products from artisans across India
        </Typography>
      </Box>

      {/* Search + Filter */}
      <Box sx={{ mb: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          fullWidth
          placeholder="Search products or artisans..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
          sx={{ flexGrow: 1, minWidth: 250 }}
        />
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Loading */}
      {loading && (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography>Loading products...</Typography>
        </Box>
      )}

      {error && (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {/* Product Grid */}
      <Grid
        container
        spacing={2}
        sx={{
          width: "100%",
          margin: 0,
          "& .MuiGrid-item": {
            paddingLeft: "16px",
            paddingTop: "16px"
          }
        }}
      >
        {filteredProducts.map((product) => (
          <Grid
            item
            xs={3}
            key={product.id}
            sx={{ boxSizing: "border-box" }}
          >
            <Card
              sx={{
                height: 500,
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                overflow: "hidden",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6
                }
              }}
            >
              {/* Image */}
              <Box sx={{ position: "relative", height: 200, flexShrink: 0, overflow: "hidden" }}>
                <CardMedia
                  component="img"
                  image={product.image}
                  alt={product.name}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "0.4s",
                    "&:hover": { transform: "scale(1.08)" }
                  }}
                />
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    background: "white",
                    padding: "4px",
                    "&:hover": { background: "white" }
                  }}
                >
                  <FavoriteBorderIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Content */}
              <CardContent sx={{ flexGrow: 1, overflow: "hidden", p: 1.5 }}>
                <Typography
                  fontWeight="bold"
                  variant="body1"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}
                >
                  {product.name}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  by {product.artisan}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {product.location}
                </Typography>

                <Box sx={{ mt: 0.5 }}>
                  <Rating value={product.rating} precision={0.5} size="small" readOnly />
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                  <Typography variant="h6" color="primary">
                    ₹{product.price.toLocaleString()}
                  </Typography>
                  <Chip label={product.category} size="small" />
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.5,
                    color: "text.secondary",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}
                >
                  {product.description}
                </Typography>
              </CardContent>

              {/* Buttons */}
              <CardActions sx={{ px: 1.5, pb: 1.5, pt: 0, flexShrink: 0 }}>
                <Button size="small" onClick={() => setSelectedProduct(product)}>
                  View
                </Button>
                <Button variant="contained" size="small" fullWidth>
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Empty */}
      {filteredProducts.length === 0 && !loading && (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography>No products found.</Typography>
        </Box>
      )}
    </Box>
  );
};

export default Marketplace;