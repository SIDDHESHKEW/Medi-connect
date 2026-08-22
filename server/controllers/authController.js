const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Pharmacy = require('../models/Pharmacy');
const mockStore = require('../store/mockStore');
const { generateToken } = require('../middleware/auth');
const { getDBStatus } = require('../config/db');

/**
 * @desc    Register a new user (Customer or Pharmacist)
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role, address, city, coordinates, pharmacyName, openingHours } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, phone, and password.',
      });
    }

    const assignedRole = ['customer', 'pharmacist', 'admin'].includes(role) ? role : 'customer';
    const userLocation = {
      type: 'Point',
      coordinates: Array.isArray(coordinates) && coordinates.length === 2 ? coordinates : [72.8777, 19.0760],
    };

    const isMongoDB = getDBStatus().connected;

    if (isMongoDB) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.',
        });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        phone,
        password,
        role: assignedRole,
        address: address || '',
        city: city || 'Mumbai',
        location: userLocation,
      });

      let pharmacy = null;
      if (assignedRole === 'pharmacist') {
        pharmacy = await Pharmacy.create({
          name: pharmacyName || `${name}'s Pharmacy`,
          owner: user._id,
          phone,
          address: address || 'Main Road',
          city: city || 'Mumbai',
          location: userLocation,
          openingHours: openingHours || '8:00 AM - 10:00 PM',
          verificationStatus: 'verified',
        });
      }

      const token = generateToken(user._id, user.role);

      return res.status(201).json({
        success: true,
        message: 'Registration successful!',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          address: user.address,
          city: user.city,
          location: user.location,
          pharmacy: pharmacy ? pharmacy._id : null,
        },
      });
    } else {
      // In-Memory Mode
      const existingUser = mockStore.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = mockStore.createUser({
        name,
        email: email.toLowerCase(),
        phone,
        password: hashedPassword,
        role: assignedRole,
        address: address || '',
        city: city || 'Mumbai',
        location: userLocation,
      });

      let pharmacy = null;
      if (assignedRole === 'pharmacist') {
        pharmacy = mockStore.createPharmacy({
          name: pharmacyName || `${name}'s Pharmacy`,
          owner: user._id,
          phone,
          address: address || 'Main Road',
          city: city || 'Mumbai',
          location: userLocation,
          openingHours: openingHours || '8:00 AM - 10:00 PM',
          verificationStatus: 'verified',
        });
      }

      const token = generateToken(user._id, user.role);

      return res.status(201).json({
        success: true,
        message: 'Registration successful!',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          address: user.address,
          city: user.city,
          location: user.location,
          pharmacy: pharmacy ? pharmacy._id : null,
        },
      });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration.',
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const isMongoDB = getDBStatus().connected;

    let user = null;
    let isMatch = false;

    if (isMongoDB) {
      user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      if (user) {
        isMatch = await user.matchPassword(password);
      }
    } else {
      user = mockStore.findUserByEmail(email);
      if (user) {
        // Support plaintext check for demo seed accounts or bcrypt hash
        if (user.password === password) {
          isMatch = true;
        } else {
          isMatch = await bcrypt.compare(password, user.password).catch(() => false);
        }
      }
    }

    if (!user || !isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'Account has been deactivated. Please contact support.',
      });
    }

    const token = generateToken(user._id, user.role);

    // If pharmacist, retrieve pharmacy id
    let pharmacy = null;
    if (user.role === 'pharmacist') {
      if (isMongoDB) {
        pharmacy = await Pharmacy.findOne({ owner: user._id });
      } else {
        pharmacy = mockStore.getPharmacyByOwner(user._id);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        city: user.city,
        location: user.location,
        pharmacy: pharmacy ? (pharmacy._id || pharmacy.id) : null,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login.',
    });
  }
};

/**
 * @desc    Get Current Logged in User Profile
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
  try {
    const user = req.user;
    const isMongoDB = getDBStatus().connected;

    let pharmacy = null;
    if (user.role === 'pharmacist') {
      if (isMongoDB) {
        pharmacy = await Pharmacy.findOne({ owner: user._id });
      } else {
        pharmacy = mockStore.getPharmacyByOwner(user._id);
      }
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        city: user.city,
        location: user.location,
        pharmacy: pharmacy ? (pharmacy._id || pharmacy.id) : null,
        pharmacyData: pharmacy || null,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving profile.',
    });
  }
};

/**
 * @desc    Update user profile & saved location
 * @route   PUT /api/auth/profile
 * @access  Private
 */
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address, city, coordinates } = req.body;
    const isMongoDB = getDBStatus().connected;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (city) updateData.city = city;
    if (Array.isArray(coordinates) && coordinates.length === 2) {
      updateData.location = { type: 'Point', coordinates };
    }

    let updatedUser;
    if (isMongoDB) {
      updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, { new: true });
    } else {
      const user = mockStore.findUserById(req.user._id);
      Object.assign(user, updateData);
      updatedUser = user;
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating profile',
    });
  }
};
