/**
 * In-Memory Demo Store for instant zero-config Hackathon execution
 * Automatically clones seed data and persists state during server runtime.
 */

const {
  users: seedUsers,
  pharmacies: seedPharmacies,
  medicines: seedMedicines,
  inventories: seedInventories,
  requests: seedRequests,
  reservations: seedReservations,
  reports: seedReports,
} = require('../seed/seedData');

class MockStore {
  constructor() {
    this.reset();
  }

  reset() {
    this.users = JSON.parse(JSON.stringify(seedUsers));
    this.pharmacies = JSON.parse(JSON.stringify(seedPharmacies));
    this.medicines = JSON.parse(JSON.stringify(seedMedicines));
    this.inventories = JSON.parse(JSON.stringify(seedInventories));
    this.requests = JSON.parse(JSON.stringify(seedRequests));
    this.reservations = JSON.parse(JSON.stringify(seedReservations));
    this.reports = JSON.parse(JSON.stringify(seedReports));
  }

  // --- Users ---
  findUserByEmail(email) {
    return this.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
  }

  findUserById(id) {
    return this.users.find((u) => u._id === id);
  }

  createUser(userData) {
    const newUser = {
      _id: 'user_' + Date.now(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...userData,
    };
    this.users.push(newUser);
    return newUser;
  }

  // --- Pharmacies ---
  getAllPharmacies() {
    return this.pharmacies.map((p) => {
      const owner = this.findUserById(p.owner);
      return { ...p, owner };
    });
  }

  getPharmacyById(id) {
    const p = this.pharmacies.find((item) => item._id === id);
    if (!p) return null;
    const owner = this.findUserById(p.owner);
    return { ...p, owner };
  }

  getPharmacyByOwner(ownerId) {
    const p = this.pharmacies.find((item) => item.owner === ownerId);
    if (!p) return null;
    const owner = this.findUserById(p.owner);
    return { ...p, owner };
  }

  createPharmacy(pharmacyData) {
    const newPharmacy = {
      _id: 'pharm_' + Date.now(),
      verificationStatus: 'verified',
      rating: 4.8,
      totalConfirmations: 0,
      unavailableReports: 0,
      createdAt: new Date(),
      ...pharmacyData,
    };
    this.pharmacies.push(newPharmacy);
    return newPharmacy;
  }

  updatePharmacy(id, updateData) {
    const idx = this.pharmacies.findIndex((p) => p._id === id);
    if (idx === -1) return null;
    this.pharmacies[idx] = {
      ...this.pharmacies[idx],
      ...updateData,
      updatedAt: new Date(),
    };
    return this.getPharmacyById(id);
  }

  // --- Medicines ---
  getAllMedicines() {
    return this.medicines;
  }

  getMedicineById(id) {
    return this.medicines.find((m) => m._id === id);
  }

  searchMedicines(query) {
    if (!query || query.trim() === '') return this.medicines;
    const q = query.toLowerCase().trim();
    return this.medicines.filter((m) => {
      const matchName = m.name && m.name.toLowerCase().includes(q);
      const matchGeneric = m.genericName && m.genericName.toLowerCase().includes(q);
      const matchCategory = m.category && m.category.toLowerCase().includes(q);
      const matchAliases = m.aliases && m.aliases.some((a) => a.toLowerCase().includes(q));
      return matchName || matchGeneric || matchCategory || matchAliases;
    });
  }

  createMedicine(medData) {
    const newMed = {
      _id: 'med_' + Date.now(),
      aliases: [],
      createdAt: new Date(),
      ...medData,
    };
    this.medicines.push(newMed);
    return newMed;
  }

  updateMedicine(id, updateData) {
    const idx = this.medicines.findIndex((m) => m._id === id);
    if (idx === -1) return null;
    this.medicines[idx] = {
      ...this.medicines[idx],
      ...updateData,
      updatedAt: new Date(),
    };
    return this.medicines[idx];
  }

  deleteMedicine(id) {
    this.medicines = this.medicines.filter((m) => m._id !== id);
    this.inventories = this.inventories.filter((i) => i.medicine !== id);
    return true;
  }

  // --- Inventory ---
  getInventoryByPharmacy(pharmacyId) {
    const items = this.inventories.filter((i) => i.pharmacy === pharmacyId);
    return items.map((inv) => {
      const medicine = this.getMedicineById(inv.medicine);
      const pharmacy = this.getPharmacyById(inv.pharmacy);
      return { ...inv, medicine, pharmacy };
    });
  }

  getInventoryByMedicine(medicineId) {
    const items = this.inventories.filter((i) => i.medicine === medicineId);
    return items.map((inv) => {
      const medicine = this.getMedicineById(inv.medicine);
      const pharmacy = this.getPharmacyById(inv.pharmacy);
      return { ...inv, medicine, pharmacy };
    });
  }

  findInventoryItem(pharmacyId, medicineId) {
    return this.inventories.find(
      (i) => i.pharmacy === pharmacyId && i.medicine === medicineId
    );
  }

  upsertInventory(pharmacyId, medicineId, data) {
    const existingIdx = this.inventories.findIndex(
      (i) => i.pharmacy === pharmacyId && i.medicine === medicineId
    );

    const now = new Date();
    if (existingIdx !== -1) {
      this.inventories[existingIdx] = {
        ...this.inventories[existingIdx],
        ...data,
        lastUpdated: now,
        updatedAt: now,
      };
      return this.inventories[existingIdx];
    } else {
      const newItem = {
        _id: 'inv_' + Date.now(),
        pharmacy: pharmacyId,
        medicine: medicineId,
        status: data.status || 'available',
        quantity: data.quantity !== undefined ? data.quantity : null,
        unitPrice: data.unitPrice !== undefined ? data.unitPrice : null,
        notes: data.notes || '',
        lastUpdated: now,
        createdAt: now,
        updatedAt: now,
      };
      this.inventories.push(newItem);
      return newItem;
    }
  }

  updateInventoryStatus(inventoryId, status, quantity, notes) {
    const idx = this.inventories.findIndex((i) => i._id === inventoryId);
    if (idx === -1) return null;
    const now = new Date();
    this.inventories[idx].status = status;
    if (quantity !== undefined) this.inventories[idx].quantity = quantity;
    if (notes !== undefined) this.inventories[idx].notes = notes;
    this.inventories[idx].lastUpdated = now;
    this.inventories[idx].updatedAt = now;

    const medicine = this.getMedicineById(this.inventories[idx].medicine);
    const pharmacy = this.getPharmacyById(this.inventories[idx].pharmacy);
    return { ...this.inventories[idx], medicine, pharmacy };
  }

  removeInventoryItem(inventoryId) {
    this.inventories = this.inventories.filter((i) => i._id !== inventoryId);
    return true;
  }

  // --- Requests ---
  createRequest(requestData) {
    const newReq = {
      _id: 'req_' + Date.now(),
      status: 'pending',
      respondedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...requestData,
    };
    this.requests.unshift(newReq);

    const customer = this.findUserById(newReq.customer);
    const pharmacy = this.getPharmacyById(newReq.pharmacy);
    const medicine = this.getMedicineById(newReq.medicine);
    return { ...newReq, customer, pharmacy, medicine };
  }

  getRequestsByCustomer(customerId) {
    return this.requests
      .filter((r) => r.customer === customerId)
      .map((r) => ({
        ...r,
        customer: this.findUserById(r.customer),
        pharmacy: this.getPharmacyById(r.pharmacy),
        medicine: this.getMedicineById(r.medicine),
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getRequestsByPharmacy(pharmacyId) {
    return this.requests
      .filter((r) => r.pharmacy === pharmacyId)
      .map((r) => ({
        ...r,
        customer: this.findUserById(r.customer),
        pharmacy: this.getPharmacyById(r.pharmacy),
        medicine: this.getMedicineById(r.medicine),
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  respondToRequest(requestId, status, pharmacistNote = '') {
    const idx = this.requests.findIndex((r) => r._id === requestId);
    if (idx === -1) return null;
    const now = new Date();
    this.requests[idx].status = status;
    this.requests[idx].pharmacistNote = pharmacistNote;
    this.requests[idx].respondedAt = now;
    this.requests[idx].updatedAt = now;

    // If available, update pharmacy inventory timestamp & confirmation count
    if (status === 'available') {
      const inv = this.findInventoryItem(
        this.requests[idx].pharmacy,
        this.requests[idx].medicine
      );
      if (inv) {
        inv.lastUpdated = now;
        inv.status = 'available';
      }
      const p = this.pharmacies.find((x) => x._id === this.requests[idx].pharmacy);
      if (p) p.totalConfirmations = (p.totalConfirmations || 0) + 1;
    }

    const r = this.requests[idx];
    return {
      ...r,
      customer: this.findUserById(r.customer),
      pharmacy: this.getPharmacyById(r.pharmacy),
      medicine: this.getMedicineById(r.medicine),
    };
  }

  // --- Reservations ---
  createReservation(resData) {
    const randomCode = 'MC-' + Math.floor(1000 + Math.random() * 9000);
    const expiresAt = new Date(Date.now() + 3 * 3600 * 1000); // 3 hours validity

    const newRes = {
      _id: 'res_' + Date.now(),
      pickupCode: randomCode,
      status: 'active',
      quantity: 1,
      collectedAt: null,
      createdAt: new Date(),
      expiresAt,
      ...resData,
    };
    this.reservations.unshift(newRes);

    const customer = this.findUserById(newRes.customer);
    const pharmacy = this.getPharmacyById(newRes.pharmacy);
    const medicine = this.getMedicineById(newRes.medicine);
    return { ...newRes, customer, pharmacy, medicine };
  }

  getReservationsByCustomer(customerId) {
    return this.reservations
      .filter((r) => r.customer === customerId)
      .map((r) => ({
        ...r,
        customer: this.findUserById(r.customer),
        pharmacy: this.getPharmacyById(r.pharmacy),
        medicine: this.getMedicineById(r.medicine),
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getReservationsByPharmacy(pharmacyId) {
    return this.reservations
      .filter((r) => r.pharmacy === pharmacyId)
      .map((r) => ({
        ...r,
        customer: this.findUserById(r.customer),
        pharmacy: this.getPharmacyById(r.pharmacy),
        medicine: this.getMedicineById(r.medicine),
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  updateReservationStatus(resId, status, cancellationReason = '') {
    const idx = this.reservations.findIndex((r) => r._id === resId);
    if (idx === -1) return null;
    const now = new Date();
    this.reservations[idx].status = status;
    if (status === 'collected') {
      this.reservations[idx].collectedAt = now;
    }
    if (cancellationReason) {
      this.reservations[idx].cancellationReason = cancellationReason;
    }
    this.reservations[idx].updatedAt = now;

    const r = this.reservations[idx];
    return {
      ...r,
      customer: this.findUserById(r.customer),
      pharmacy: this.getPharmacyById(r.pharmacy),
      medicine: this.getMedicineById(r.medicine),
    };
  }

  // --- Reports ---
  createReport(reportData) {
    const newReport = {
      _id: 'rep_' + Date.now(),
      status: 'resolved',
      createdAt: new Date(),
      ...reportData,
    };
    this.reports.unshift(newReport);

    // If report is unavailable, increment pharmacy unavailable counter
    if (reportData.result === 'unavailable') {
      const p = this.pharmacies.find((x) => x._id === reportData.pharmacy);
      if (p) p.unavailableReports = (p.unavailableReports || 0) + 1;
    } else {
      const p = this.pharmacies.find((x) => x._id === reportData.pharmacy);
      if (p) p.totalConfirmations = (p.totalConfirmations || 0) + 1;
    }

    const customer = this.findUserById(newReport.customer);
    const pharmacy = this.getPharmacyById(newReport.pharmacy);
    const medicine = this.getMedicineById(newReport.medicine);
    return { ...newReport, customer, pharmacy, medicine };
  }

  getAllReports() {
    return this.reports.map((r) => ({
      ...r,
      customer: this.findUserById(r.customer),
      pharmacy: this.getPharmacyById(r.pharmacy),
      medicine: this.getMedicineById(r.medicine),
    }));
  }
}

// Singleton instance
const mockStore = new MockStore();
module.exports = mockStore;
