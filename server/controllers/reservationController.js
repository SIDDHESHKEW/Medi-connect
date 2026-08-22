const Reservation = require('../models/Reservation');
const Pharmacy = require('../models/Pharmacy');
const Medicine = require('../models/Medicine');
const mockStore = require('../store/mockStore');
const { getDBStatus } = require('../config/db');

/**
 * @desc    Create a Medicine Reservation for physical collection
 * @route   POST /api/reservations
 * @access  Private (Customer)
 */
exports.createReservation = async (req, res) => {
  try {
    const { pharmacyId, medicineId, quantity = 1 } = req.body;
    const isMongoDB = getDBStatus().connected;

    if (!pharmacyId || !medicineId) {
      return res.status(400).json({
        success: false,
        message: 'Pharmacy and Medicine are required to create a reservation',
      });
    }

    const pickupCode = 'MC-' + Math.floor(1000 + Math.random() * 9000);
    const expiresAt = new Date(Date.now() + 3 * 3600 * 1000); // 3 hour pickup hold

    let reservation;

    if (isMongoDB) {
      reservation = await Reservation.create({
        customer: req.user._id,
        pharmacy: pharmacyId,
        medicine: medicineId,
        quantity: Math.min(10, Math.max(1, parseInt(quantity, 10))),
        pickupCode,
        status: 'active',
        expiresAt,
      });

      const populated = await Reservation.findById(reservation._id)
        .populate('customer', 'name phone email')
        .populate('pharmacy', 'name address phone openingHours')
        .populate('medicine', 'name genericName category dosageForm');

      return res.status(201).json({
        success: true,
        message: `Reservation confirmed! Your pickup code is ${pickupCode}. Please collect within 3 hours.`,
        data: populated,
      });
    } else {
      reservation = mockStore.createReservation({
        customer: req.user._id,
        pharmacy: pharmacyId,
        medicine: medicineId,
        quantity: Math.min(10, Math.max(1, parseInt(quantity, 10))),
      });

      return res.status(201).json({
        success: true,
        message: `Reservation confirmed! Your pickup code is ${reservation.pickupCode}. Please collect within 3 hours.`,
        data: reservation,
      });
    }
  } catch (error) {
    console.error('Reservation Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to reserve medicine',
      error: error.message,
    });
  }
};

/**
 * @desc    Get Reservations for logged-in Customer
 * @route   GET /api/reservations/user
 * @access  Private (Customer)
 */
exports.getUserReservations = async (req, res) => {
  try {
    const isMongoDB = getDBStatus().connected;

    if (isMongoDB) {
      const list = await Reservation.find({ customer: req.user._id })
        .populate('pharmacy', 'name address phone city openingHours')
        .populate('medicine', 'name genericName category dosageForm')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: list.length,
        data: list,
      });
    } else {
      const list = mockStore.getReservationsByCustomer(req.user._id);

      return res.status(200).json({
        success: true,
        count: list.length,
        data: list,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve your reservations',
    });
  }
};

/**
 * @desc    Get Reservations for a Pharmacy (Pharmacist)
 * @route   GET /api/reservations/pharmacy
 * @access  Private (Pharmacist)
 */
exports.getPharmacyReservations = async (req, res) => {
  try {
    const isMongoDB = getDBStatus().connected;
    let pharmacyId = req.query.pharmacyId;

    if (!pharmacyId) {
      if (isMongoDB) {
        const pharm = await Pharmacy.findOne({ owner: req.user._id });
        if (pharm) pharmacyId = pharm._id;
      } else {
        const pharm = mockStore.getPharmacyByOwner(req.user._id);
        if (pharm) pharmacyId = pharm._id;
      }
    }

    if (!pharmacyId) {
      return res.status(404).json({
        success: false,
        message: 'No pharmacy associated with this account',
      });
    }

    if (isMongoDB) {
      const list = await Reservation.find({ pharmacy: pharmacyId })
        .populate('customer', 'name phone email')
        .populate('medicine', 'name genericName category dosageForm')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        pharmacyId,
        count: list.length,
        data: list,
      });
    } else {
      const list = mockStore.getReservationsByPharmacy(pharmacyId);

      return res.status(200).json({
        success: true,
        pharmacyId,
        count: list.length,
        data: list,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve reservations',
    });
  }
};

/**
 * @desc    Update Reservation Status (Mark Collected or Cancel)
 * @route   PUT /api/reservations/:id
 * @access  Private (Customer or Pharmacist)
 */
exports.updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, cancellationReason } = req.body; // 'collected' | 'cancelled'
    const isMongoDB = getDBStatus().connected;

    if (!['collected', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be "collected" or "cancelled"',
      });
    }

    const now = new Date();

    if (isMongoDB) {
      const updateData = { status };
      if (status === 'collected') updateData.collectedAt = now;
      if (cancellationReason) updateData.cancellationReason = cancellationReason;

      const updated = await Reservation.findByIdAndUpdate(id, updateData, { new: true })
        .populate('customer', 'name phone email')
        .populate('pharmacy', 'name address phone')
        .populate('medicine', 'name genericName');

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Reservation not found' });
      }

      return res.status(200).json({
        success: true,
        message: status === 'collected' ? 'Medicine marked as collected by customer!' : 'Reservation cancelled',
        data: updated,
      });
    } else {
      const updated = mockStore.updateReservationStatus(id, status, cancellationReason);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Reservation not found' });
      }

      return res.status(200).json({
        success: true,
        message: status === 'collected' ? 'Medicine marked as collected by customer!' : 'Reservation cancelled',
        data: updated,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update reservation status',
    });
  }
};
