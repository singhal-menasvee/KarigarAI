import React, { useState } from "react";
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

import { useUser, useClerk, SignedIn } from "@clerk/clerk-react";

// Mock data since we don't have the actual imports
const dashboardStats = {
  totalArtisans: 1250,
  totalProducts: 3000,
  totalSales: 1250000,
  monthlyGrowth: 12.5
};

const ArtisanDetailsTable = () => (
  <div>Artisan Details Table Component</div>
);

const drawerWidth = 240;

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { user } = useUser();
  const { signOut } = useClerk();

  const stats = [
    {
      title: "Total Artisans",
      value: dashboardStats.totalArtisans.toLocaleString(),
      icon: <People sx={{ fontSize: 40, color: "primary.main" }} />,
      change: "+5.2%",
    },
    {
      title: "Total Products",
      value: dashboardStats.totalProducts.toLocaleString(),
      icon: <ShoppingCart sx={{ fontSize: 40, color: "secondary.main" }} />,
      change: "+8.1%",
    },
    {
      title: "Total Sales",
      value: `₹${(dashboardStats.totalSales / 100000).toFixed(1)}L`,
      icon: <MonetizationOn sx={{ fontSize: 40, color: "success.main" }} />,
      change: "+12.5%",
    },
    {
      title: "Monthly Growth",
      value: `${dashboardStats.monthlyGrowth}%`,
      icon: <TrendingUp sx={{ fontSize: 40, color: "warning.main" }} />,
      change: "+2.1%",
    },
  ];

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
    { text: "My Products", icon: <Store />, id: "products" },
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

  return (
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

              {/* Stats - Fixed Grid v2 usage */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((stat, index) => (
                  <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ p: 2 }}>
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box>
                            <Typography color="text.secondary" gutterBottom>
                              {stat.title}
                            </Typography>
                            <Typography variant="h5">{stat.value}</Typography>
                            <Typography variant="body2" color="success.main">
                              {stat.change} from last month
                            </Typography>
                          </Box>
                          {stat.icon}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Graphs - Fixed Grid v2 usage and ResponsiveContainer */}
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, height: 400 }}>
                    <Typography variant="h6" gutterBottom>
                      Sales by Craft
                    </Typography>
                    <Box sx={{ width: '100%', height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="craft" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="sales" fill="#1976d2" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, height: 400 }}>
                    <Typography variant="h6" gutterBottom>
                      Monthly Growth
                    </Typography>
                    <Box sx={{ width: '100%', height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={growthData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="growth" stroke="#82ca9d" strokeWidth={3} />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Container>
          )}

          {activeSection === "products" && (
            <Container maxWidth="xl">
              <Typography variant="h5" gutterBottom>
                My Products
              </Typography>
              <ArtisanDetailsTable />
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
      </Box>
    </SignedIn>
  );
};

export default Dashboard;