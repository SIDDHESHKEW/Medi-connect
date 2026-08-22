const express = require('express');
const router = express.Router();
const {
  getInventoryByPharmacy,
  updateInventoryStatus,
  addInventoryItem,
  removeInventoryItem,
} = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/auth');

router.get('/pharmacy/:pharmacyId', getInventoryByPharmacy);
router.put('/:id/status', protect, authorize('pharmacist', 'admin'), updateInventoryStatus);
router.post('/', protect, authorize('pharmacist', 'admin'), addInventoryItem);
router.delete('/:id', protect, authorize('pharmacist', 'admin'), removeInventoryItem);

module.exports = router;
