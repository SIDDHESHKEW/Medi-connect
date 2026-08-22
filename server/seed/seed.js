const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

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
    console.log('⚠️  No MONGODB_URI found in .env.');
    console.log('⚡ The application is already preloaded with these exact seed data records in the In-Memory store for instant demo!');
    process.exit(0);
  }

  try {
    await mongoose.connect(uri);
    console.log('✓ Connected to MongoDB for seeding...');

    // Clear existing
    await User.deleteMany();
    await Pharmacy.deleteMany();
    await Medicine.deleteMany();
    await Inventory.deleteMany();
    await Request.deleteMany();
    await Reservation.deleteMany();
    await AvailabilityReport.deleteMany();

    console.log('  Cleared old collections.');

    // Hash passwords for seed users
    const salt = await bcrypt.genSalt(10);
    const usersWithHashedPw = await Promise.all(
      users.map(async (u) => {
        const hashed = await bcrypt.hash(u.password, salt);
        return { ...u, password: hashed };
      })
    );

    // Insert
    await User.insertMany(usersWithHashedPw);
    console.log(`✓ Inserted ${users.length} Users`);

    await Pharmacy.insertMany(pharmacies);
    console.log(`✓ Inserted ${pharmacies.length} Pharmacies`);

    await Medicine.insertMany(medicines);
    console.log(`✓ Inserted ${medicines.length} Medicines`);

    await Inventory.insertMany(inventories);
    console.log(`✓ Inserted ${inventories.length} Inventory items`);

    await Request.insertMany(requests);
    console.log(`✓ Inserted ${requests.length} Requests`);

    await Reservation.insertMany(reservations);
    console.log(`✓ Inserted ${reservations.length} Reservations`);

    await AvailabilityReport.insertMany(reports);
    console.log(`✓ Inserted ${reports.length} Reports`);

    console.log('\n🎉 Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
