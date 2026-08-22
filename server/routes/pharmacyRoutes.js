const express = require('express');
const router = express.Router();
const {
  getNearbyPharmacies,
  getPharmacyById,
  updatePharmacy,
  updateVerificationStatus,
} = require('../controllers/pharmacyController');
const { protect, authorize } = require('../middleware/auth');

router.get('/nearby', getNearbyPharmacies);
router.get('/', getNearbyPharmacies);
router.get('/:id', getPharmacyById);

router.put('/:id', protect, authorize('pharmacist', 'admin'), updatePharmacy);
router.put('/:id/status', protect, authorize('admin'), updateVerificationStatus);

module.exports = router;
