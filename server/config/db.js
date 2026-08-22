const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.trim() === '') {
    console.log('\x1b[33m%s\x1b[0m', 'ℹ [MediConnect DB] MONGODB_URI not configured in .env.');
    console.log('\x1b[36m%s\x1b[0m', '⚡ [MediConnect DB] Running with Resilient In-Memory Data Store (Instant Hackathon Demo Mode).');
    console.log('\x1b[90m%s\x1b[0m', '  To connect real MongoDB Atlas later, add MONGODB_URI to server/.env and restart.');
    isConnected = false;
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('\x1b[32m%s\x1b[0m', `✓ [MediConnect DB] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `✗ [MediConnect DB] MongoDB Connection Error: ${error.message}`);
    console.log('\x1b[36m%s\x1b[0m', '⚡ [MediConnect DB] Falling back to In-Memory Demo Store for unbroken availability.');
    isConnected = false;
    return false;
  }
};

const getDBStatus = () => ({
  connected: isConnected,
  type: isConnected ? 'MongoDB Atlas / Local' : 'In-Memory Demo Engine',
});

module.exports = { connectDB, getDBStatus };
