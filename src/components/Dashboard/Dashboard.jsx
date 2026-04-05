import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  Container,
  Card,
  CardContent,
  Paper,
  Button,
  TextField,
  IconButton,
  Badge,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
} from "@mui/material";
import { Grid } from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People,
  ShoppingCart,
  MonetizationOn,
  TrendingUp,
  Store,
  TipsAndUpdates,
  Groups,
  Notifications,
  Search,
  Logout,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import ArtisanDetailsTable from "./ArtisanDetailsTable";
import { useUser, SignedIn, SignedOut } from "@clerk/clerk-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

// import { useUser, useClerk, SignedIn } from "@clerk/clerk-react";

const drawerWidth = 240;

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [addProductForm, setAddProductForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    location: "",
    images: [],
  });
  const [productImagesFiles, setProductImagesFiles] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const { user: clerkUser } = useUser() || {};

  const user = clerkUser
    ? {
        firstName: clerkUser.firstName || clerkUser.username || "User",
        lastName: clerkUser.lastName || "",
        fullName: clerkUser.fullName || clerkUser.username || "User",
        primaryEmailAddress: clerkUser.primaryEmailAddress,
      }
    : null;

  const isArtisan = profile?.role === "artisan";

  useEffect(() => {
    async function loadProfile() {
      if (!user?.primaryEmailAddress?.emailAddress) return;
      try {
        setLoadingProfile(true);
        const emailValue = user.primaryEmailAddress.emailAddress;
        const email = encodeURIComponent(emailValue);

        // Ensure profile exists (automatic profile creation on first visit / signup)
        await fetch("/api/profile/bootstrap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: user.fullName || user.firstName || "User",
            email: emailValue,
          }),
        });

        const resp = await fetch(`/api/profile?email=${email}`);
        if (!resp.ok) throw new Error("Failed to load profile");
        const data = await resp.json();
        setProfile(data);
      } catch (err) {
        setSnackbar({
          open: true,
          message: err?.message || "Failed to load profile",
          severity: "error",
        });
      } finally {
        setLoadingProfile(false);
      }
    }

    loadProfile();
  }, [user?.primaryEmailAddress?.emailAddress, user?.fullName, user?.firstName]);

  useEffect(() => {
    async function loadArtisanProducts() {
      if (!profile?.artisanId) return;
      try {
        setLoadingProducts(true);
        const resp = await fetch(`/api/artisans/${profile.artisanId}/products`);
        if (!resp.ok) throw new Error("Failed to load products");
        const data = await resp.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setSnackbar({
          open: true,
          message: err?.message || "Failed to load products",
          severity: "error",
        });
      } finally {
        setLoadingProducts(false);
      }
    }
    loadArtisanProducts();
  }, [profile?.artisanId]);

  const artisanStats = useMemo(() => {
    const totalProducts = Array.isArray(products) ? products.length : 0;
    const totalSales = Array.isArray(products)
      ? products.reduce((sum, p) => sum + (p.views || 0), 0)
      : 0;
    const revenue = Array.isArray(products)
      ? products.reduce((sum, p) => sum + (p.price || 0) * (p.views || 0), 0)
      : 0;
    return { totalProducts, totalSales, revenue };
  }, [products]);

  const salesData = [
    { craft: "Saree", sales: 12500 },
    { craft: "Pottery", sales: 4500 },
    { craft: "Toys", sales: 6000 },
    { craft: "Painting", sales: 7500 },
  ];

  const growthData = [
    { month: "Jan", growth: 5 },
    { month: "Feb", growth: 7 },
    { month: "Mar", growth: 9 },
    { month: "Apr", growth: 6 },
    { month: "May", growth: 11 },
  ];

  const menuItems = [
    { text: "Overview", icon: <DashboardIcon />, id: "overview" },
    { text: "Profile", icon: <People />, id: "profile" },
    ...(isArtisan
      ? [
          { text: "Add Product", icon: <Store />, id: "addProduct" },
          { text: "My Products", icon: <Store />, id: "products" },
        ]
      : []),
    { text: "Sales Tips", icon: <TipsAndUpdates />, id: "tips" },
    { text: "Community", icon: <Groups />, id: "community" },
  ];

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "U";
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (user.fullName) {
      return user.fullName.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
    }
    if (user.emailAddresses[0]?.emailAddress) {
      return user.emailAddresses[0].emailAddress[0].toUpperCase();
    }
    return "U";
  };

  const profileDefaults = useMemo(
    () => ({
      username: user?.fullName || user?.firstName || "",
      email: user?.primaryEmailAddress?.emailAddress || "",
      phone: "",
      address: "",
      bio: "",
      profileImage: "",
      role: "user",
    }),
    [user?.fullName, user?.firstName, user?.primaryEmailAddress?.emailAddress]
  );

  const effectiveProfile = profile || profileDefaults;

  const handleProfileChange = (field) => (event) => {
    const value = event.target.value;
    setProfile((prev) => {
      const base = prev || effectiveProfile;
      return { ...base, [field]: value };
    });
  };

  const handleSaveProfile = async () => {
    const emailValue = effectiveProfile.email;
    if (!emailValue) return;
    try {
      setSavingProfile(true);
      const email = encodeURIComponent(emailValue);
      const resp = await fetch(`/api/profile?email=${email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: effectiveProfile.username,
          phone: effectiveProfile.phone,
          address: effectiveProfile.address,
          bio: effectiveProfile.bio,
          profileImage: effectiveProfile.profileImage || undefined,
        }),
      });
      if (!resp.ok) {
        let msg = `Failed to update profile (${resp.status})`;
        try {
          const data = await resp.json();
          msg = data?.error?.message || data?.message || msg;
        } catch {
          // ignore
        }
        throw new Error(msg);
      }
      const data = await resp.json();
      setProfile(data);
      setSnackbar({
        open: true,
        message: "Profile updated successfully",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.message || "Failed to update profile",
        severity: "error",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleRegisterArtisan = async () => {
    const emailValue = effectiveProfile.email;
    if (!emailValue) return;
    try {
      const nameValue = (effectiveProfile.username || "").trim() || "Artisan";
      // backend expects max 120 for location; address can be longer
      const locationValue = (effectiveProfile.address || "").trim().slice(0, 120);
      // backend validates URL if profileImage is present; don't send empty string
      const maybeProfileImage =
        typeof effectiveProfile.profileImage === "string" && effectiveProfile.profileImage.trim()
          ? effectiveProfile.profileImage.trim()
          : undefined;

      const resp = await fetch("/api/profile/register-artisan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailValue,
          name: nameValue,
          location: locationValue || "",
          craftTypes: [],
          ...(maybeProfileImage ? { profileImage: maybeProfileImage } : {}),
          bio: effectiveProfile.bio || "",
        }),
      });
      if (!resp.ok) {
        let msg = `Failed to register as artisan (${resp.status})`;
        try {
          const data = await resp.json();
          msg = data?.error?.message || data?.message || msg;
        } catch {
          // ignore
        }
        throw new Error(msg);
      }
      const data = await resp.json();
      setProfile(data);
      setActiveSection("addProduct");
      setSnackbar({
        open: true,
        message: "You are now registered as an artisan",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.message || "Failed to register as artisan",
        severity: "error",
      });
    }
  };

  const handleProductFieldChange = (field) => (event) => {
    const value = event.target.value;
    setAddProductForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleProductImagesChange = (event) => {
    const files = Array.from(event.target.files || []);
    setProductImagesFiles(files);
  };

  const validateProductForm = () => {
    const errors = {};
    if (!addProductForm.title.trim()) errors.title = "Product name is required";
    if (!addProductForm.category.trim()) errors.category = "Category is required";
    if (!addProductForm.price || Number(addProductForm.price) <= 0)
      errors.price = "Valid price is required";
    if (!addProductForm.stock || Number(addProductForm.stock) < 0)
      errors.stock = "Stock is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitProduct = async (event) => {
    event.preventDefault();
    if (!profile?.artisanId) {
      setSnackbar({
        open: true,
        message: "You must register as an artisan to add products",
        severity: "error",
      });
      return;
    }
    if (!validateProductForm()) return;

    try {
      const formData = new FormData();
      formData.append("title", addProductForm.title);
      formData.append("description", addProductForm.description);
      formData.append("price", String(addProductForm.price));
      formData.append("category", addProductForm.category);
      formData.append("artisanId", profile.artisanId);
      formData.append("artisanName", profile.username);
      formData.append("location", addProductForm.location || "");
      formData.append("stock", String(addProductForm.stock));

      productImagesFiles.forEach((file) => {
        formData.append("images", file);
      });

      const resp = await fetch("/api/products/test", {
        method: "POST",
        body: formData,
      });
      if (!resp.ok) throw new Error("Failed to create product");
      const created = await resp.json();

      setProducts((prev) => [created, ...prev]);
      setAddProductForm({
        title: "",
        description: "",
        category: "",
        price: "",
        stock: "",
        location: "",
        images: [],
      });
      setProductImagesFiles([]);
      setFormErrors({});
      setSnackbar({
        open: true,
        message: "Product created successfully",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.message || "Failed to create product",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <SignedOut>
        <Box sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Please sign in to access your dashboard.
          </Typography>
        </Box>
      </SignedOut>
      <SignedIn>
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#fdf5e6",
          },
        }}
      >
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Avatar sx={{ bgcolor: "primary.main", width: 64, height: 64, mb: 1 }}>
              {getUserInitials()}
            </Avatar>
            <Typography variant="h6" align="center">
              {user?.firstName || user?.fullName || "Artisan"}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              {user?.primaryEmailAddress?.emailAddress || "Local Seller"}
            </Typography>
          </Box>
        </Toolbar>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                selected={activeSection === item.id}
                onClick={() => setActiveSection(item.id)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem disablePadding>
            <ListItemButton onClick={() => signOut()}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          px: 3,
          pt: 2,
          pb: 8,
          minHeight: "100vh",
        }}
      >
        {activeSection === "overview" && (
          <Container maxWidth="xl">
            {/* Welcome message with user info */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" gutterBottom>
                Welcome back, {user?.firstName || "Artisan"}!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Here's your business overview for today.
              </Typography>
            </Box>

            {/* Top Filters */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              {/* Search */}
              <TextField
                size="small"
                placeholder="Search crafts..."
                InputProps={{
                  startAdornment: <Search sx={{ color: "gray", mr: 1 }} />,
                }}
                sx={{ width: "40%" }}
              />

              {/* Date Picker */}
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Select Date"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  slotProps={{ textField: { size: "small" } }}
                />
              </LocalizationProvider>

              {/* Notifications */}
              <IconButton>
                <Badge color="error" variant="dot">
                  <Notifications />
                </Badge>
              </IconButton>
            </Box>

            {artisanStats.totalProducts === 0 ? (
              <Paper sx={{ p: 3, mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  No sales data yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Jab aap products upload karenge aur sales / views aayenge, yahan par unka summary dikhega.
                </Typography>
              </Paper>
            ) : (
              <>
                {/* Basic stats from real data */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Card sx={{ p: 2 }}>
                      <CardContent>
                        <Typography color="text.secondary" gutterBottom>
                          Total Products Listed
                        </Typography>
                        <Typography variant="h5">
                          {artisanStats.totalProducts}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Card sx={{ p: 2 }}>
                      <CardContent>
                        <Typography color="text.secondary" gutterBottom>
                          Total Sales (views)
                        </Typography>
                        <Typography variant="h5">
                          {artisanStats.totalSales}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Card sx={{ p: 2 }}>
                      <CardContent>
                        <Typography color="text.secondary" gutterBottom>
                          Revenue (approx)
                        </Typography>
                        <Typography variant="h5">
                          ₹{artisanStats.revenue.toLocaleString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </>
            )}
          </Container>
        )}

        {activeSection === "profile" && (
          <Container maxWidth="md">
            <Typography variant="h5" gutterBottom>
              Profile Management
            </Typography>
            <Paper sx={{ p: 3, mt: 2 }}>
              {loadingProfile && (
                <Typography variant="body2" color="text.secondary">
                  Loading profile...
                </Typography>
              )}
                <Box
                  component="form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveProfile();
                  }}
                  sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  <TextField
                    label="Username"
                  value={effectiveProfile.username || ""}
                    onChange={handleProfileChange("username")}
                    fullWidth
                    required
                  />
                  <TextField
                    label="Email"
                  value={effectiveProfile.email || ""}
                    fullWidth
                    disabled
                  />
                  <TextField
                    label="Phone Number"
                  value={effectiveProfile.phone || ""}
                    onChange={handleProfileChange("phone")}
                    fullWidth
                  />
                  <TextField
                    label="Address"
                  value={effectiveProfile.address || ""}
                    onChange={handleProfileChange("address")}
                    fullWidth
                    multiline
                    minRows={2}
                  />
                  <TextField
                    label="Bio"
                  value={effectiveProfile.bio || ""}
                    onChange={handleProfileChange("bio")}
                    fullWidth
                    multiline
                    minRows={3}
                  />
                  <TextField
                    label="Profile Image URL"
                  value={effectiveProfile.profileImage || ""}
                    onChange={handleProfileChange("profileImage")}
                    fullWidth
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 2,
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={savingProfile}
                    >
                      {savingProfile ? "Updating..." : "Update Profile"}
                    </Button>
                    {effectiveProfile.role !== "artisan" && (
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleRegisterArtisan}
                      >
                        Register as Artisan
                      </Button>
                    )}
                  </Box>
                </Box>
              
            </Paper>
          </Container>
        )}

        {activeSection === "addProduct" && isArtisan && (
          <Container maxWidth="md">
            <Typography variant="h5" gutterBottom>
              Add Product
            </Typography>
            <Paper sx={{ p: 3, mt: 2 }}>
              <Box
                component="form"
                onSubmit={handleSubmitProduct}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <TextField
                  label="Product Name"
                  value={addProductForm.title}
                  onChange={handleProductFieldChange("title")}
                  fullWidth
                  required
                  error={!!formErrors.title}
                  helperText={formErrors.title}
                />
                <TextField
                  label="Product Description"
                  value={addProductForm.description}
                  onChange={handleProductFieldChange("description")}
                  fullWidth
                  multiline
                  minRows={3}
                />
                <FormControl fullWidth required error={!!formErrors.category}>
                  <InputLabel>Product Category</InputLabel>
                  <Select
                    value={addProductForm.category}
                    label="Product Category"
                    onChange={handleProductFieldChange("category")}
                  >
                    <MenuItem value="Pottery">Pottery</MenuItem>
                    <MenuItem value="Textiles">Textiles</MenuItem>
                    <MenuItem value="Metalwork">Metalwork</MenuItem>
                    <MenuItem value="Woodwork">Woodwork</MenuItem>
                    <MenuItem value="Jewelry">Jewelry</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Price (₹)"
                  type="number"
                  value={addProductForm.price}
                  onChange={handleProductFieldChange("price")}
                  fullWidth
                  required
                  error={!!formErrors.price}
                  helperText={formErrors.price}
                />
                <TextField
                  label="Available Stock"
                  type="number"
                  value={addProductForm.stock}
                  onChange={handleProductFieldChange("stock")}
                  fullWidth
                  required
                  error={!!formErrors.stock}
                  helperText={formErrors.stock}
                />
                <TextField
                  label="Location"
                  value={addProductForm.location}
                  onChange={handleProductFieldChange("location")}
                  fullWidth
                />
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Product Images
                  </Typography>
                  <Button variant="outlined" component="label">
                    Upload Images
                    <input
                      hidden
                      multiple
                      type="file"
                      accept="image/*"
                      onChange={handleProductImagesChange}
                    />
                  </Button>
                  {productImagesFiles.length > 0 && (
                    <Typography variant="caption" sx={{ ml: 2 }}>
                      {productImagesFiles.length} file(s) selected
                    </Typography>
                  )}
                </Box>
                <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                  <Button type="submit" variant="contained">
                    Create Product
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Container>
        )}

        {activeSection === "products" && (
          <Container maxWidth="xl">
            <Typography variant="h5" gutterBottom>
              My Products
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Total Products Listed: {artisanStats.totalProducts}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Sales (views): {artisanStats.totalSales}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Revenue (approx): ₹{artisanStats.revenue.toLocaleString()}
              </Typography>
            </Box>
            {loadingProducts && (
              <Typography variant="body2" color="text.secondary">
                Loading products...
              </Typography>
            )}
            {!loadingProducts && products.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No products uploaded yet.
              </Typography>
            )}
            {!loadingProducts && products.length > 0 && (
              <ArtisanDetailsTable products={products} />
            )}
          </Container>
        )}

        {activeSection === "tips" && (
          <Container maxWidth="lg">
            <Typography variant="h5" gutterBottom>
              Sales Tips
            </Typography>
            <Paper sx={{ p: 3, mt: 2 }}>
              <Typography>
                📢 Use bright photos of your products.
                🛒 Share your items on WhatsApp groups.
                💬 Talk to customers in simple words.
                🎯 Keep prices clear and fair.
              </Typography>
            </Paper>
          </Container>
        )}

        {activeSection === "community" && (
          <Container maxWidth="lg">
            <Typography variant="h5" gutterBottom>
              Community
            </Typography>
            <Paper sx={{ p: 3, mt: 2 }}>
              <Typography>
                Connect with other artisans, share stories, and learn together.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" color="primary">
                  Join Community Forum
                </Button>
              </Box>
            </Paper>
          </Container>
        )}
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
      </SignedIn>
    </>
  );
};

export default Dashboard;