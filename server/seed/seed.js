const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Pharmacy = require('../models/Pharmacy');
const Medicine = require('../models/Medicine');
const Inventory = require('../models/Inventory');
const Request = require('../models/Request');
const Reservation = require('../models/Reservation');
const AvailabilityReport = require('../models/AvailabilityReport');

const {
  users,
  pharmacies,
  medicines,
  inventories,
  requests,
  reservations,
  reports,
} = require('./seedData');

const seedDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.trim() === '') {
    console.log('ℹ [MediConnect DB] MONGODB_URI not configured in .env.');
    console.log('⚡ Application is running in In-Memory Demo mode.');
    process.exit(0);
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log('✓ MongoDB connected successfully for seeding...');

    // Clear existing collections
    await User.deleteMany({});
    await Pharmacy.deleteMany({});
    await Medicine.deleteMany({});
    await Inventory.deleteMany({});
    await Request.deleteMany({});
    await Reservation.deleteMany({});
    await AvailabilityReport.deleteMany({});

    console.log('  Cleared existing collections.');

    // Map custom string IDs to valid MongoDB ObjectIds for relational integrity
    const userMap = {};
    const pharmMap = {};
    const medMap = {};

    // 1. Users
    const salt = await bcrypt.genSalt(10);
    const createdUsers = [];
    for (const u of users) {
      const oid = new mongoose.Types.ObjectId();
      userMap[u._id] = oid;
      const hashedPassword = await bcrypt.hash(u.password, salt);
      createdUsers.push({
        ...u,
        _id: oid,
        password: hashedPassword,
      });
    }
    await User.insertMany(createdUsers);
    console.log(`✓ Inserted ${createdUsers.length} Users`);

    // 2. Pharmacies
    const createdPharmacies = [];
    for (const p of pharmacies) {
      const oid = new mongoose.Types.ObjectId();
      pharmMap[p._id] = oid;
      createdPharmacies.push({
        ...p,
        _id: oid,
        owner: userMap[p.owner] || userMap['user_pharm_1'],
      });
    }
    await Pharmacy.insertMany(createdPharmacies);
    console.log(`✓ Inserted ${createdPharmacies.length} Pharmacies`);

    // 3. Medicines
    const createdMedicines = [];
    for (const m of medicines) {
      const oid = new mongoose.Types.ObjectId();
      medMap[m._id] = oid;
      createdMedicines.push({
        ...m,
        _id: oid,
      });
    }
    await Medicine.insertMany(createdMedicines);
    console.log(`✓ Inserted ${createdMedicines.length} Medicines`);

    // 4. Inventory
    const createdInventory = [];
    for (const inv of inventories) {
      const pharmId = pharmMap[inv.pharmacy];
      const medId = medMap[inv.medicine];
      if (pharmId && medId) {
        createdInventory.push({
          ...inv,
          _id: new mongoose.Types.ObjectId(),
          pharmacy: pharmId,
          medicine: medId,
        });
      }
    }
    await Inventory.insertMany(createdInventory);
    console.log(`✓ Inserted ${createdInventory.length} Inventory items`);

    // 5. Requests
    const createdRequests = [];
    for (const req of requests) {
      const custId = userMap[req.customer];
      const pharmId = pharmMap[req.pharmacy];
      const medId = medMap[req.medicine];
      if (custId && pharmId && medId) {
        createdRequests.push({
          ...req,
          _id: new mongoose.Types.ObjectId(),
          customer: custId,
          pharmacy: pharmId,
          medicine: medId,
        });
      }
    }
    await Request.insertMany(createdRequests);
    console.log(`✓ Inserted ${createdRequests.length} Requests`);

    // 6. Reservations
    const createdReservations = [];
    for (const res of reservations) {
      const custId = userMap[res.customer];
      const pharmId = pharmMap[res.pharmacy];
      const medId = medMap[res.medicine];
      if (custId && pharmId && medId) {
        createdReservations.push({
          ...res,
          _id: new mongoose.Types.ObjectId(),
          customer: custId,
          pharmacy: pharmId,
          medicine: medId,
        });
      }
    }
    await Reservation.insertMany(createdReservations);
    console.log(`✓ Inserted ${createdReservations.length} Reservations`);

    // 7. Reports
    const createdReports = [];
    for (const rep of reports) {
      const custId = userMap[rep.customer];
      const pharmId = pharmMap[rep.pharmacy];
      const medId = medMap[rep.medicine];
      if (custId && pharmId && medId) {
        createdReports.push({
          ...rep,
          _id: new mongoose.Types.ObjectId(),
          customer: custId,
          pharmacy: pharmId,
          medicine: medId,
        });
      }
    }
    await AvailabilityReport.insertMany(createdReports);
    console.log(`✓ Inserted ${createdReports.length} Reports`);

    console.log('\n🎉 Seed completed successfully into MongoDB!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();
