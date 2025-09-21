import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Card, CardContent } from '@mui/material';

const rows = [
  { id: 1, craft: 'Handloom Saree', views: 350, orders: 25, earnings: 12500, trend: 'up' },
  { id: 2, craft: 'Clay Pottery Set', views: 220, orders: 10, earnings: 4500, trend: 'down' },
  { id: 3, craft: 'Wooden Toys', views: 180, orders: 12, earnings: 6000, trend: 'up' },
  { id: 4, craft: 'Madhubani Painting', views: 90, orders: 3, earnings: 7500, trend: 'flat' },
];

const columns = [
  { field: 'craft', headerName: 'Craft Name', flex: 2 },
  { field: 'views', headerName: 'People Viewed 👀', flex: 1, type: 'number' },
  { field: 'orders', headerName: 'Orders Received 🛒', flex: 1, type: 'number' },
  { field: 'earnings', headerName: 'Money Earned (₹) 💰', flex: 1, type: 'number' },
  {
    field: 'trend',
    headerName: 'Trend',
    flex: 1,
    renderCell: (params) => {
      switch (params.value) {
        case 'up':
          return <span style={{ color: 'green' }}>📈 Growing</span>;
        case 'down':
          return <span style={{ color: 'red' }}>📉 Fewer Sales</span>;
        default:
          return <span style={{ color: 'gray' }}>➖ Stable</span>;
      }
    },
  },
];

export default function ArtisanDetailsTable() {
  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Your Crafts Performance
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          This table shows how your products are doing. Simple and clear ✨
        </Typography>
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            sx={{
              border: 0,
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#FAF3E0',
                fontWeight: 'bold',
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
