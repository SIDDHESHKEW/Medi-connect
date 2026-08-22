const express = require('express');
const router = express.Router();
const {
  searchMedicines,
  getMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
} = require('../controllers/medicineController');
const { protect, authorize } = require('../middleware/auth');

router.get('/search', searchMedicines);
router.get('/', getMedicines);
router.get('/:id', getMedicineById);

// Admin & Pharmacist write routes
router.post('/', protect, authorize('admin', 'pharmacist'), createMedicine);
router.put('/:id', protect, authorize('admin'), updateMedicine);
router.delete('/:id', protect, authorize('admin'), deleteMedicine);

module.exports = router;
