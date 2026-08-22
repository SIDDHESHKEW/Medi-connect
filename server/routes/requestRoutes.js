const express = require('express');
const router = express.Router();
const {
  createRequest,
  getUserRequests,
  getPharmacyRequests,
  respondToRequest,
} = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('customer', 'admin'), createRequest);
router.get('/user', protect, getUserRequests);
router.get('/pharmacy', protect, authorize('pharmacist', 'admin'), getPharmacyRequests);
router.put('/:id/respond', protect, authorize('pharmacist', 'admin'), respondToRequest);

module.exports = router;
