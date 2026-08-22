const express = require('express');
const router = express.Router();
const {
  createReservation,
  getUserReservations,
  getPharmacyReservations,
  updateReservationStatus,
} = require('../controllers/reservationController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('customer', 'admin'), createReservation);
router.get('/user', protect, getUserReservations);
router.get('/pharmacy', protect, authorize('pharmacist', 'admin'), getPharmacyReservations);
router.put('/:id', protect, updateReservationStatus);

module.exports = router;
