const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mockStore = require('../store/mockStore');
const { getDBStatus } = require('../config/db');

// Safe development secret fallback if user hasn't configured JWT_SECRET in .env yet
const DEV_JWT_SECRET = 'mediconnect_super_secret_jwt_key_dev_2024';

const getJwtSecret = () => {
  return process.env.JWT_SECRET && process.env.JWT_SECRET.trim() !== ''
    ? process.env.JWT_SECRET
    : DEV_JWT_SECRET;
};

/**
 * Protect routes - Verifies JWT in Authorization header
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please log in to proceed.',
    });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    const dbStatus = getDBStatus();

    let user = null;
    if (dbStatus.connected) {
      user = await User.findById(decoded.id).select('-password');
    } else {
      user = mockStore.findUserById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'Account has been deactivated. Please contact support.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token. Please log in again.',
    });
  }
};

/**
 * Grant access to specific roles ('customer', 'pharmacist', 'admin')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user ? req.user.role : 'unauthorized'}' is not authorized to access this resource.`,
      });
    }
    next();
  };
};

/**
 * Generate signed JWT Token
 */
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, getJwtSecret(), {
    expiresIn: '7d',
  });
};

module.exports = {
  protect,
  authorize,
  generateToken,
  getJwtSecret,
};
