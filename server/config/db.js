const mongoose = require('mongoose');
const dns = require('dns');

// Only configure custom DNS resolvers on Windows if needed, preserving standard container DNS on Linux/Render
if (process.platform === 'win32') {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
  } catch (e) {
    // Ignore
  }
}

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.trim() === '') {
    console.log('\x1b[33m%s\x1b[0m', 'ℹ [MediConnect DB] MONGODB_URI not configured.');
    console.log('\x1b[36m%s\x1b[0m', '⚡ [MediConnect DB] Running with Resilient In-Memory Data Store.');
    isConnected = false;
    return false;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    console.log('\x1b[32m%s\x1b[0m', '✓ MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `✗ [MediConnect DB] MongoDB Connection failed: ${error.message}`);
    console.log('\x1b[36m%s\x1b[0m', '⚡ [MediConnect DB] Falling back to In-Memory Demo Store for continuous operation.');
    isConnected = false;
    return false;
  }
};

const getDBStatus = () => ({
  connected: isConnected,
  type: isConnected ? 'MongoDB Atlas / Connected' : 'In-Memory Demo Engine',
});

module.exports = { connectDB, getDBStatus };
