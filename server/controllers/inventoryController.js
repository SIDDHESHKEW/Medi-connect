const Inventory = require('../models/Inventory');
const Pharmacy = require('../models/Pharmacy');
const Medicine = require('../models/Medicine');
const mockStore = require('../store/mockStore');
const { getDBStatus } = require('../config/db');
const { calculateFreshness, calculateConfidence } = require('../utils/freshness');

/**
 * @desc    Get inventory for a specific pharmacy
 * @route   GET /api/inventory/pharmacy/:pharmacyId
 * @access  Public
 */
exports.getInventoryByPharmacy = async (req, res) => {
  try {
    const { pharmacyId } = req.params;
    const isMongoDB = getDBStatus().connected;

    let items = [];
    let pharmacy = null;

    if (isMongoDB) {
      pharmacy = await Pharmacy.findById(pharmacyId);
      if (!pharmacy) {
        return res.status(404).json({ success: false, message: 'Pharmacy not found' });
      }

      const inv = await Inventory.find({ pharmacy: pharmacyId }).populate('medicine');
      items = inv.map((item) => {
        const freshness = calculateFreshness(item.lastUpdated);
        const confidence = calculateConfidence({
          lastUpdated: item.lastUpdated,
          status: item.status,
          totalConfirmations: pharmacy.totalConfirmations,
          unavailableReports: pharmacy.unavailableReports,
          verificationStatus: pharmacy.verificationStatus,
        });

        return {
          id: item._id,
          medicine: item.medicine,
          status: item.status,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          notes: item.notes,
          lastUpdated: item.lastUpdated,
          freshness,
          confidence,
        };
      });
    } else {
      pharmacy = mockStore.getPharmacyById(pharmacyId);
      if (!pharmacy) {
        return res.status(404).json({ success: false, message: 'Pharmacy not found' });
      }

      const inv = mockStore.getInventoryByPharmacy(pharmacyId);
      items = inv.map((item) => {
        const freshness = calculateFreshness(item.lastUpdated);
        const confidence = calculateConfidence({
          lastUpdated: item.lastUpdated,
          status: item.status,
          totalConfirmations: pharmacy.totalConfirmations,
          unavailableReports: pharmacy.unavailableReports,
          verificationStatus: pharmacy.verificationStatus,
        });

        return {
          id: item._id,
          medicine: item.medicine,
          status: item.status,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          notes: item.notes,
          lastUpdated: item.lastUpdated,
          freshness,
          confidence,
        };
      });
    }

    // Sort by most recently updated
    items.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));

    return res.status(200).json({
      success: true,
      pharmacy: {
        id: pharmacy._id || pharmacy.id,
        name: pharmacy.name,
        verificationStatus: pharmacy.verificationStatus,
      },
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory',
    });
  }
};

/**
 * @desc    Update Medicine Availability in Seconds (Available / Low / Out)
 * @route   PUT /api/inventory/:id/status
 * @access  Private (Pharmacist)
 */
exports.updateInventoryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, quantity, notes } = req.body;
    const isMongoDB = getDBStatus().connected;

    if (!['available', 'low', 'out'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be one of: available, low, out',
      });
    }

    let updatedItem = null;
    const now = new Date();

    if (isMongoDB) {
      updatedItem = await Inventory.findByIdAndUpdate(
        id,
        {
          status,
          ...(quantity !== undefined && { quantity }),
          ...(notes !== undefined && { notes }),
          lastUpdated: now,
          lastUpdatedBy: req.user._id,
        },
        { new: true }
      ).populate('medicine pharmacy');
    } else {
      updatedItem = mockStore.updateInventoryStatus(id, status, quantity, notes);
    }

    if (!updatedItem) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    const freshness = calculateFreshness(updatedItem.lastUpdated);

    return res.status(200).json({
      success: true,
      message: `Availability updated to ${status.toUpperCase()} in real-time!`,
      data: {
        ...updatedItem._doc ? updatedItem._doc : updatedItem,
        freshness,
      },
    });
  } catch (error) {
    console.error('Error updating status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update availability status',
    });
  }
};

/**
 * @desc    Add Medicine to Pharmacy Inventory
 * @route   POST /api/inventory
 * @access  Private (Pharmacist)
 */
exports.addInventoryItem = async (req, res) => {
  try {
    const { pharmacyId, medicineId, medicineName, genericName, category, status, quantity, unitPrice, notes } = req.body;
    const isMongoDB = getDBStatus().connected;

    let targetPharmacyId = pharmacyId;

    // If pharmacist is logged in and didn't supply pharmacyId, find their pharmacy
    if (!targetPharmacyId && req.user && req.user.role === 'pharmacist') {
      if (isMongoDB) {
        const pharm = await Pharmacy.findOne({ owner: req.user._id });
        if (pharm) targetPharmacyId = pharm._id;
      } else {
        const pharm = mockStore.getPharmacyByOwner(req.user._id);
        if (pharm) targetPharmacyId = pharm._id;
      }
    }

    if (!targetPharmacyId) {
      return res.status(400).json({ success: false, message: 'Pharmacy ID is required' });
    }

    let targetMedicineId = medicineId;

    // If a new medicine name was typed instead of an existing ID, create/find it in catalogue
    if (!targetMedicineId && medicineName) {
      if (isMongoDB) {
        let existingMed = await Medicine.findOne({
          name: { $regex: new RegExp(`^${medicineName.trim()}$`, 'i') },
        });
        if (!existingMed) {
          existingMed = await Medicine.create({
            name: medicineName.trim(),
            genericName: genericName || medicineName.trim(),
            category: category || 'General Healthcare',
          });
        }
        targetMedicineId = existingMed._id;
      } else {
        let existingMed = mockStore.getAllMedicines().find(
          (m) => m.name.toLowerCase() === medicineName.trim().toLowerCase()
        );
        if (!existingMed) {
          existingMed = mockStore.createMedicine({
            name: medicineName.trim(),
            genericName: genericName || medicineName.trim(),
            category: category || 'General Healthcare',
          });
        }
        targetMedicineId = existingMed._id;
      }
    }

    if (!targetMedicineId) {
      return res.status(400).json({ success: false, message: 'Please specify a medicine' });
    }

    const itemStatus = ['available', 'low', 'out'].includes(status) ? status : 'available';

    let item;
    if (isMongoDB) {
      item = await Inventory.findOneAndUpdate(
        { pharmacy: targetPharmacyId, medicine: targetMedicineId },
        {
          status: itemStatus,
          quantity: quantity !== undefined && quantity !== '' ? Number(quantity) : null,
          unitPrice: unitPrice !== undefined && unitPrice !== '' ? Number(unitPrice) : null,
          notes: notes || '',
          lastUpdated: new Date(),
          lastUpdatedBy: req.user ? req.user._id : null,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).populate('medicine');
    } else {
      item = mockStore.upsertInventory(targetPharmacyId, targetMedicineId, {
        status: itemStatus,
        quantity: quantity !== undefined && quantity !== '' ? Number(quantity) : null,
        unitPrice: unitPrice !== undefined && unitPrice !== '' ? Number(unitPrice) : null,
        notes: notes || '',
      });
      const med = mockStore.getMedicineById(targetMedicineId);
      item = { ...item, medicine: med };
    }

    return res.status(201).json({
      success: true,
      message: 'Medicine successfully added/updated in your inventory!',
      data: item,
    });
  } catch (error) {
    console.error('Error adding inventory item:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add item to inventory',
      error: error.message,
    });
  }
};

/**
 * @desc    Remove Medicine from Pharmacy Inventory
 * @route   DELETE /api/inventory/:id
 * @access  Private (Pharmacist)
 */
exports.removeInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const isMongoDB = getDBStatus().connected;

    if (isMongoDB) {
      await Inventory.findByIdAndDelete(id);
    } else {
      mockStore.removeInventoryItem(id);
    }

    return res.status(200).json({
      success: true,
      message: 'Medicine removed from your inventory',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete inventory item',
    });
  }
};
