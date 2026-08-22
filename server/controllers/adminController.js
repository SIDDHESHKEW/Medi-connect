const User = require('../models/User');
const Pharmacy = require('../models/Pharmacy');
const Medicine = require('../models/Medicine');
const Request = require('../models/Request');
const Reservation = require('../models/Reservation');
const AvailabilityReport = require('../models/AvailabilityReport');
const mockStore = require('../store/mockStore');
const { getDBStatus } = require('../config/db');

/**
 * @desc    Get Admin Overview Statistics
 * @route   GET /api/admin/stats
 * @access  Private (Admin)
 */
exports.getAdminStats = async (req, res) => {
  try {
    const isMongoDB = getDBStatus().connected;

    if (isMongoDB) {
      const [
        totalUsers,
        totalPharmacies,
        totalMedicines,
        totalRequests,
        totalReservations,
        totalReports,
      ] = await Promise.all([
        User.countDocuments(),
        Pharmacy.countDocuments(),
        Medicine.countDocuments(),
        Request.countDocuments(),
        Reservation.countDocuments(),
        AvailabilityReport.countDocuments(),
      ]);

      const pendingPharmacies = await Pharmacy.countDocuments({ verificationStatus: 'pending' });
      const activeReservations = await Reservation.countDocuments({ status: 'active' });

      return res.status(200).json({
        success: true,
        data: {
          totalUsers,
          totalPharmacies,
          totalMedicines,
          totalRequests,
          totalReservations,
          totalReports,
          pendingPharmacies,
          activeReservations,
          dbStatus: getDBStatus(),
        },
      });
    } else {
      const totalUsers = mockStore.users.length;
      const totalPharmacies = mockStore.pharmacies.length;
      const totalMedicines = mockStore.medicines.length;
      const totalRequests = mockStore.requests.length;
      const totalReservations = mockStore.reservations.length;
      const totalReports = mockStore.reports.length;

      const pendingPharmacies = mockStore.pharmacies.filter((p) => p.verificationStatus === 'pending').length;
      const activeReservations = mockStore.reservations.filter((r) => r.status === 'active').length;

      return res.status(200).json({
        success: true,
        data: {
          totalUsers,
          totalPharmacies,
          totalMedicines,
          totalRequests,
          totalReservations,
          totalReports,
          pendingPharmacies,
          activeReservations,
          dbStatus: getDBStatus(),
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch admin statistics',
    });
  }
};

/**
 * @desc    Get Users List (Admin)
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
exports.getUsers = async (req, res) => {
  try {
    const isMongoDB = getDBStatus().connected;

    if (isMongoDB) {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: users.length, data: users });
    } else {
      const users = mockStore.users.map(({ password, ...u }) => u);
      return res.status(200).json({ success: true, count: users.length, data: users });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

/**
 * @desc    Toggle User Active Status (Admin)
 * @route   PUT /api/admin/users/:id/toggle
 * @access  Private (Admin)
 */
exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const isMongoDB = getDBStatus().connected;

    if (isMongoDB) {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      user.isActive = !user.isActive;
      await user.save();
      return res.status(200).json({
        success: true,
        message: `User is now ${user.isActive ? 'Active' : 'Suspended'}`,
        data: user,
      });
    } else {
      const user = mockStore.findUserById(id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      user.isActive = user.isActive === false ? true : false;
      return res.status(200).json({
        success: true,
        message: `User is now ${user.isActive ? 'Active' : 'Suspended'}`,
        data: user,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to toggle user status' });
  }
};

/**
 * @desc    Get All Pharmacies for Admin
 * @route   GET /api/admin/pharmacies
 * @access  Private (Admin)
 */
exports.getPharmacies = async (req, res) => {
  try {
    const isMongoDB = getDBStatus().connected;

    if (isMongoDB) {
      const pharmacies = await Pharmacy.find().populate('owner', 'name email phone').sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: pharmacies.length, data: pharmacies });
    } else {
      const pharmacies = mockStore.getAllPharmacies();
      return res.status(200).json({ success: true, count: pharmacies.length, data: pharmacies });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch pharmacies' });
  }
};
