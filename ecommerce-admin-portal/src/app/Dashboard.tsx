import React from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';

const Dashboard: React.FC = () => {
  return (
    <Container>
      <Typography variant="h1">Admin Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper>
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h4">500</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Paper>
            <Typography variant="h6">Total Sales</Typography>
            <Typography variant="h4">$2,500</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Paper>
            <Typography variant="h6">Total Orders</Typography>
            <Typography variant="h4">150</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;

