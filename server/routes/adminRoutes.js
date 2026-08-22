const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getUsers,
  toggleUserStatus,
  getPharmacies,
} = require('../controllers/adminController');
const { getReports } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.put('/users/:id/toggle', toggleUserStatus);
router.get('/pharmacies', getPharmacies);
router.get('/reports', getReports);

module.exports = router;
