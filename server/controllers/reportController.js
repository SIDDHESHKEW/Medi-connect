const AvailabilityReport = require('../models/AvailabilityReport');
const Pharmacy = require('../models/Pharmacy');
const mockStore = require('../store/mockStore');
const { getDBStatus } = require('../config/db');

/**
 * @desc    Submit Community Feedback ("Was the medicine available?")
 * @route   POST /api/reports
 * @access  Private (Customer)
 */
exports.createReport = async (req, res) => {
  try {
    const { pharmacyId, medicineId, result, comment } = req.body;
    const isMongoDB = getDBStatus().connected;

    if (!pharmacyId || !medicineId || !['available', 'unavailable'].includes(result)) {
      return res.status(400).json({
        success: false,
        message: 'Pharmacy ID, Medicine ID, and result (available/unavailable) are required',
      });
    }

    if (isMongoDB) {
      const report = await AvailabilityReport.create({
        customer: req.user._id,
        pharmacy: pharmacyId,
        medicine: medicineId,
        result,
        comment: comment || '',
        status: 'resolved',
      });

      if (result === 'unavailable') {
        await Pharmacy.findByIdAndUpdate(pharmacyId, {
          $inc: { unavailableReports: 1 },
        });
      } else {
        await Pharmacy.findByIdAndUpdate(pharmacyId, {
          $inc: { totalConfirmations: 1 },
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Thank you for your community feedback! It helps others find medicines faster.',
        data: report,
      });
    } else {
      const report = mockStore.createReport({
        customer: req.user._id,
        pharmacy: pharmacyId,
        medicine: medicineId,
        result,
        comment: comment || '',
      });

      return res.status(201).json({
        success: true,
        message: 'Thank you for your community feedback! It helps others find medicines faster.',
        data: report,
      });
    }
  } catch (error) {
    console.error('Report submission error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit feedback report',
    });
  }
};

/**
 * @desc    Get all community reports (Admin / Public Summary)
 * @route   GET /api/reports
 * @access  Public
 */
exports.getReports = async (req, res) => {
  try {
    const isMongoDB = getDBStatus().connected;

    if (isMongoDB) {
      const reports = await AvailabilityReport.find()
        .populate('pharmacy', 'name address city')
        .populate('medicine', 'name genericName')
        .populate('customer', 'name')
        .sort({ createdAt: -1 })
        .limit(50);

      return res.status(200).json({
        success: true,
        count: reports.length,
        data: reports,
      });
    } else {
      const reports = mockStore.getAllReports();

      return res.status(200).json({
        success: true,
        count: reports.length,
        data: reports,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve reports',
    });
  }
};
