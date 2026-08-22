const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB, getDBStatus } = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: '*', // Allow all origins for hackathon ease
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB or activate In-Memory Demo Store
connectDB();

// API Health and Diagnostic route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'MediConnect API Server',
    version: '1.0.0',
    tagline: 'Find the Right Medicine. Right Place. Right Time.',
    database: getDBStatus(),
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/medicines', require('./routes/medicineRoutes'));
app.use('/api/pharmacies', require('./routes/pharmacyRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// 404 Route handler
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on MediConnect API`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Unhandled Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('\n======================================================');
  console.log('   🏥  MediConnect API Server is Active');
  console.log(`   📡  Port: http://localhost:${PORT}`);
  console.log(`   🩺  Health Check: http://localhost:${PORT}/api/health`);
  console.log('======================================================\n');
});

module.exports = app;
