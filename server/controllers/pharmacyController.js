const Pharmacy = require('../models/Pharmacy');
const Inventory = require('../models/Inventory');
const mockStore = require('../store/mockStore');
const { getDBStatus } = require('../config/db');
const { calculateFreshness, calculateConfidence, calculateHaversineDistance } = require('../utils/freshness');

/**
 * @desc    Get nearby pharmacies sorted by distance
 * @route   GET /api/pharmacies/nearby?lat=19.0760&lng=72.8777
 * @access  Public
 */
exports.getNearbyPharmacies = async (req, res) => {
  try {
    const { lat, lng, limit = 20 } = req.query;
    const isMongoDB = getDBStatus().connected;

    const userCoords =
      lat && lng ? [parseFloat(lng), parseFloat(lat)] : [72.8350, 19.0596];

    let pharmacies = [];

    if (isMongoDB) {
      pharmacies = await Pharmacy.find({ verificationStatus: { $ne: 'suspended' } })
        .populate('owner', 'name email phone')
        .limit(parseInt(limit, 10));
    } else {
      pharmacies = mockStore
        .getAllPharmacies()
        .filter((p) => p.verificationStatus !== 'suspended');
    }

    const formatted = pharmacies
      .map((p) => {
        const coords = p.location?.coordinates || [72.8400, 19.0550];
        const distance = calculateHaversineDistance(userCoords, coords);

        return {
          id: p._id,
          name: p.name,
          phone: p.phone,
          address: p.address,
          city: p.city,
          openingHours: p.openingHours,
          licenseNumber: p.licenseNumber,
          verificationStatus: p.verificationStatus,
          rating: p.rating,
          totalConfirmations: p.totalConfirmations,
          unavailableReports: p.unavailableReports,
          location: p.location,
          distanceKm: distance,
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return res.status(200).json({
      success: true,
      userLocation: { lng: userCoords[0], lat: userCoords[1] },
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.error('Error finding pharmacies:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to find nearby pharmacies',
    });
  }
};

/**
 * @desc    Get single pharmacy details and its current inventory
 * @route   GET /api/pharmacies/:id?lat=&lng=
 * @access  Public
 */
exports.getPharmacyById = async (req, res) => {
  try {
    const { id } = req.params;
    const { lat, lng } = req.query;
    const isMongoDB = getDBStatus().connected;

    const userCoords = lat && lng ? [parseFloat(lng), parseFloat(lat)] : [72.8350, 19.0596];

    let pharmacy = null;
    let inventoryItems = [];

    if (isMongoDB) {
      pharmacy = await Pharmacy.findById(id).populate('owner', 'name email phone');
      if (!pharmacy) {
        return res.status(404).json({ success: false, message: 'Pharmacy not found' });
      }

      const invList = await Inventory.find({ pharmacy: id }).populate('medicine');
      inventoryItems = invList
        .filter((i) => i.medicine)
        .map((i) => {
          const freshness = calculateFreshness(i.lastUpdated);
          const confidence = calculateConfidence({
            lastUpdated: i.lastUpdated,
            status: i.status,
            totalConfirmations: pharmacy.totalConfirmations,
            unavailableReports: pharmacy.unavailableReports,
            verificationStatus: pharmacy.verificationStatus,
          });

          return {
            id: i._id,
            medicine: i.medicine,
            status: i.status,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            lastUpdated: i.lastUpdated,
            freshness,
            confidence,
          };
        });
    } else {
      pharmacy = mockStore.getPharmacyById(id);
      if (!pharmacy) {
        return res.status(404).json({ success: false, message: 'Pharmacy not found' });
      }

      const invList = mockStore.getInventoryByPharmacy(id);
      inventoryItems = invList
        .filter((i) => i.medicine)
        .map((i) => {
          const freshness = calculateFreshness(i.lastUpdated);
          const confidence = calculateConfidence({
            lastUpdated: i.lastUpdated,
            status: i.status,
            totalConfirmations: pharmacy.totalConfirmations,
            unavailableReports: pharmacy.unavailableReports,
            verificationStatus: pharmacy.verificationStatus,
          });

          return {
            id: i._id,
            medicine: i.medicine,
            status: i.status,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            lastUpdated: i.lastUpdated,
            freshness,
            confidence,
          };
        });
    }

    const distance = calculateHaversineDistance(
      userCoords,
      pharmacy.location?.coordinates || [72.8400, 19.0550]
    );

    return res.status(200).json({
      success: true,
      data: {
        ...pharmacy._doc ? pharmacy._doc : pharmacy,
        distanceKm: distance,
        inventory: inventoryItems,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve pharmacy',
      error: error.message,
    });
  }
};

/**
 * @desc    Update Pharmacy profile (Pharmacist)
 * @route   PUT /api/pharmacies/:id
 * @access  Private (Pharmacist / Admin)
 */
exports.updatePharmacy = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, address, city, openingHours, latitude, longitude } = req.body;
    const isMongoDB = getDBStatus().connected;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;
    if (address) updateFields.address = address;
    if (city) updateFields.city = city;
    if (openingHours) updateFields.openingHours = openingHours;
    if (latitude && longitude) {
      updateFields.location = {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      };
    }

    let updated;
    if (isMongoDB) {
      updated = await Pharmacy.findByIdAndUpdate(id, updateFields, { new: true });
    } else {
      updated = mockStore.updatePharmacy(id, updateFields);
    }

    return res.status(200).json({
      success: true,
      message: 'Pharmacy information updated successfully',
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update pharmacy',
    });
  }
};

/**
 * @desc    Update verification status (Admin)
 * @route   PUT /api/pharmacies/:id/status
 * @access  Private (Admin)
 */
exports.updateVerificationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { verificationStatus } = req.body; // 'pending' | 'verified' | 'suspended'
    const isMongoDB = getDBStatus().connected;

    if (!['pending', 'verified', 'suspended'].includes(verificationStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid verification status' });
    }

    let updated;
    if (isMongoDB) {
      updated = await Pharmacy.findByIdAndUpdate(
        id,
        { verificationStatus },
        { new: true }
      );
    } else {
      updated = mockStore.updatePharmacy(id, { verificationStatus });
    }

    return res.status(200).json({
      success: true,
      message: `Pharmacy status updated to ${verificationStatus}`,
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update verification status',
    });
  }
};
