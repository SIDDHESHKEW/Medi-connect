const Request = require('../models/Request');
const Pharmacy = require('../models/Pharmacy');
const Medicine = require('../models/Medicine');
const Inventory = require('../models/Inventory');
const mockStore = require('../store/mockStore');
const { getDBStatus } = require('../config/db');

/**
 * @desc    Customer sends a "Request Availability" to a pharmacy
 * @route   POST /api/requests
 * @access  Private (Customer)
 */
exports.createRequest = async (req, res) => {
  try {
    const { pharmacyId, medicineId, customerNote } = req.body;
    const isMongoDB = getDBStatus().connected;

    if (!pharmacyId || !medicineId) {
      return res.status(400).json({
        success: false,
        message: 'Pharmacy and Medicine IDs are required',
      });
    }

    let request;

    if (isMongoDB) {
      request = await Request.create({
        customer: req.user._id,
        pharmacy: pharmacyId,
        medicine: medicineId,
        customerNote: customerNote || 'Inquiring availability before traveling',
        status: 'pending',
      });

      const populated = await Request.findById(request._id)
        .populate('customer', 'name email phone')
        .populate('pharmacy', 'name address phone openingHours')
        .populate('medicine', 'name genericName category dosageForm');

      return res.status(201).json({
        success: true,
        message: 'Availability request sent to pharmacist!',
        data: populated,
      });
    } else {
      request = mockStore.createRequest({
        customer: req.user._id,
        pharmacy: pharmacyId,
        medicine: medicineId,
        customerNote: customerNote || 'Inquiring availability before traveling',
      });

      return res.status(201).json({
        success: true,
        message: 'Availability request sent to pharmacist!',
        data: request,
      });
    }
  } catch (error) {
    console.error('Error creating request:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send availability request',
      error: error.message,
    });
  }
};

/**
 * @desc    Get requests sent by current customer
 * @route   GET /api/requests/user
 * @access  Private (Customer)
 */
exports.getUserRequests = async (req, res) => {
  try {
    const isMongoDB = getDBStatus().connected;

    if (isMongoDB) {
      const requests = await Request.find({ customer: req.user._id })
        .populate('pharmacy', 'name address phone openingHours')
        .populate('medicine', 'name genericName category dosageForm')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: requests.length,
        data: requests,
      });
    } else {
      const requests = mockStore.getRequestsByCustomer(req.user._id);

      return res.status(200).json({
        success: true,
        count: requests.length,
        data: requests,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve your requests',
    });
  }
};

/**
 * @desc    Get requests received by pharmacy
 * @route   GET /api/requests/pharmacy
 * @access  Private (Pharmacist)
 */
exports.getPharmacyRequests = async (req, res) => {
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
        message: 'No pharmacy found associated with this account',
      });
    }

    if (isMongoDB) {
      const requests = await Request.find({ pharmacy: pharmacyId })
        .populate('customer', 'name phone email')
        .populate('medicine', 'name genericName category dosageForm')
        .populate('pharmacy', 'name address')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        pharmacyId,
        count: requests.length,
        data: requests,
      });
    } else {
      const requests = mockStore.getRequestsByPharmacy(pharmacyId);

      return res.status(200).json({
        success: true,
        pharmacyId,
        count: requests.length,
        data: requests,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve pharmacy requests',
    });
  }
};

/**
 * @desc    Pharmacist responds to an availability request (Available / Not Available)
 * @route   PUT /api/requests/:id/respond
 * @access  Private (Pharmacist)
 */
exports.respondToRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, pharmacistNote } = req.body; // 'available' | 'not_available'
    const isMongoDB = getDBStatus().connected;

    if (!['available', 'not_available'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "available" or "not_available"',
      });
    }

    const now = new Date();

    if (isMongoDB) {
      const request = await Request.findById(id);
      if (!request) {
        return res.status(404).json({ success: false, message: 'Request not found' });
      }

      request.status = status;
      request.pharmacistNote = pharmacistNote || (status === 'available' ? 'Stock is available at our counter' : 'Currently out of stock');
      request.respondedAt = now;
      await request.save();

      // If available, update pharmacy inventory timestamp and confirmations
      if (status === 'available') {
        await Inventory.findOneAndUpdate(
          { pharmacy: request.pharmacy, medicine: request.medicine },
          { status: 'available', lastUpdated: now },
          { upsert: true }
        );
        await Pharmacy.findByIdAndUpdate(request.pharmacy, {
          $inc: { totalConfirmations: 1 },
        });
      }

      const updated = await Request.findById(id)
        .populate('customer', 'name phone email')
        .populate('medicine', 'name genericName')
        .populate('pharmacy', 'name address phone');

      return res.status(200).json({
        success: true,
        message: `Response submitted: Medicine marked as ${status === 'available' ? 'AVAILABLE' : 'NOT AVAILABLE'}`,
        data: updated,
      });
    } else {
      const updated = mockStore.respondToRequest(id, status, pharmacistNote);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Request not found' });
      }

      return res.status(200).json({
        success: true,
        message: `Response submitted: Medicine marked as ${status === 'available' ? 'AVAILABLE' : 'NOT AVAILABLE'}`,
        data: updated,
      });
    }
  } catch (error) {
    console.error('Error responding to request:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to respond to request',
    });
  }
};
