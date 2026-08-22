/**
 * Initial Realistic Seed Data for Hackathon Demo
 */

const users = [
  {
    _id: 'user_cust_1',
    name: 'Rahul Sharma',
    email: 'customer@mediconnect.com',
    phone: '+91 98765 43210',
    password: 'password123',
    role: 'customer',
    address: 'Flat 402, Sunshine Apts, Bandra West',
    city: 'Mumbai',
    location: { type: 'Point', coordinates: [72.8350, 19.0596] },
    isActive: true,
  },
  {
    _id: 'user_pharm_1',
    name: 'Vikram Joshi (Pharmacist)',
    email: 'pharmacist@mediconnect.com',
    phone: '+91 98220 11223',
    password: 'password123',
    role: 'pharmacist',
    address: 'Shop 12, Station Road, Bandra West',
    city: 'Mumbai',
    location: { type: 'Point', coordinates: [72.8400, 19.0550] },
    isActive: true,
  },
  {
    _id: 'user_pharm_2',
    name: 'Anita Desai (Pharmacist)',
    email: 'healthplus@mediconnect.com',
    phone: '+91 98110 44556',
    password: 'password123',
    role: 'pharmacist',
    address: 'Plot 45, Linking Road, Khar West',
    city: 'Mumbai',
    location: { type: 'Point', coordinates: [72.8310, 19.0680] },
    isActive: true,
  },
  {
    _id: 'user_pharm_3',
    name: 'Suresh Patil (Pharmacist)',
    email: 'citycare@mediconnect.com',
    phone: '+91 98330 99887',
    password: 'password123',
    role: 'pharmacist',
    address: '22, Hill Road, Bandra West',
    city: 'Mumbai',
    location: { type: 'Point', coordinates: [72.8250, 19.0520] },
    isActive: true,
  },
  {
    _id: 'user_admin_1',
    name: 'MediConnect Admin',
    email: 'admin@mediconnect.com',
    phone: '+91 99999 00000',
    password: 'adminpassword',
    role: 'admin',
    address: 'MediConnect HQ, Tech Park, BKC',
    city: 'Mumbai',
    location: { type: 'Point', coordinates: [72.8656, 19.0674] },
    isActive: true,
  },
];

const pharmacies = [
  {
    _id: 'pharm_1',
    name: 'ABC Medical Store',
    owner: 'user_pharm_1',
    phone: '+91 98220 11223',
    address: 'Shop 12, Station Road, Bandra West',
    city: 'Mumbai',
    location: { type: 'Point', coordinates: [72.8400, 19.0550] },
    openingHours: '8:00 AM - 11:00 PM',
    licenseNumber: 'DL-MH-2023-9081',
    verificationStatus: 'verified',
    rating: 4.9,
    totalConfirmations: 42,
    unavailableReports: 1,
    createdAt: new Date(Date.now() - 30 * 86400000),
  },
  {
    _id: 'pharm_2',
    name: 'HealthPlus Pharmacy',
    owner: 'user_pharm_2',
    phone: '+91 98110 44556',
    address: 'Plot 45, Linking Road, Khar West',
    city: 'Mumbai',
    location: { type: 'Point', coordinates: [72.8310, 19.0680] },
    openingHours: '24 Hours Open',
    licenseNumber: 'DL-MH-2022-7712',
    verificationStatus: 'verified',
    rating: 4.7,
    totalConfirmations: 28,
    unavailableReports: 2,
    createdAt: new Date(Date.now() - 60 * 86400000),
  },
  {
    _id: 'pharm_3',
    name: 'City Care Pharmacy',
    owner: 'user_pharm_3',
    phone: '+91 98330 99887',
    address: '22, Hill Road, Bandra West',
    city: 'Mumbai',
    location: { type: 'Point', coordinates: [72.8250, 19.0520] },
    openingHours: '9:00 AM - 10:00 PM',
    licenseNumber: 'DL-MH-2024-3401',
    verificationStatus: 'verified',
    rating: 4.5,
    totalConfirmations: 15,
    unavailableReports: 0,
    createdAt: new Date(Date.now() - 15 * 86400000),
  },
  {
    _id: 'pharm_4',
    name: 'Lifeline Chemist & Druggist',
    owner: 'user_pharm_1',
    phone: '+91 98440 22334',
    address: 'Shop 5, SV Road, Santacruz West',
    city: 'Mumbai',
    location: { type: 'Point', coordinates: [72.8380, 19.0810] },
    openingHours: '8:30 AM - 10:30 PM',
    licenseNumber: 'DL-MH-2021-1120',
    verificationStatus: 'verified',
    rating: 4.6,
    totalConfirmations: 19,
    unavailableReports: 1,
    createdAt: new Date(Date.now() - 90 * 86400000),
  },
];

const medicines = [
  {
    _id: 'med_1',
    name: 'Paracetamol 650',
    genericName: 'Acetaminophen 650mg',
    category: 'Pain Relief & Fever',
    dosageForm: 'Tablet',
    strength: '650 mg',
    manufacturer: 'Micro Labs (Dolo)',
    prescriptionRequired: false,
    description: 'Fast-acting antipyretic and analgesic tablet used for fever, body aches, and headaches.',
    aliases: ['Dolo 650', 'Calpol 650', 'Crocin 650', 'P-650', 'Para 650'],
    createdAt: new Date(Date.now() - 100 * 86400000),
  },
  {
    _id: 'med_2',
    name: 'Cetirizine 10',
    genericName: 'Cetirizine Hydrochloride 10mg',
    category: 'Allergy & Respiratory',
    dosageForm: 'Tablet',
    strength: '10 mg',
    manufacturer: 'Dr. Reddy Labs (Cetzine)',
    prescriptionRequired: false,
    description: 'Second-generation antihistamine used to relieve allergy symptoms such as watery eyes, runny nose, and itching.',
    aliases: ['Cetzine 10', 'Alerid 10', 'Zyrtec', 'Okacet 10'],
    createdAt: new Date(Date.now() - 100 * 86400000),
  },
  {
    _id: 'med_3',
    name: 'Azithromycin 500',
    genericName: 'Azithromycin 500mg',
    category: 'Antibiotics',
    dosageForm: 'Tablet',
    strength: '500 mg',
    manufacturer: 'Cipla (Azee 500)',
    prescriptionRequired: true,
    description: 'Broad-spectrum macrolide antibiotic used to treat various respiratory and bacterial infections.',
    aliases: ['Azee 500', 'Azithral 500', 'Zithromax'],
    createdAt: new Date(Date.now() - 100 * 86400000),
  },
  {
    _id: 'med_4',
    name: 'ORS (Oral Rehydration Salts)',
    genericName: 'Sodium Chloride, Potassium Chloride, Dextrose, Sodium Citrate',
    category: 'First Aid & Rehydration',
    dosageForm: 'Sachet',
    strength: '21.8 g sachet (WHO Formula)',
    manufacturer: 'FDC (Electral)',
    prescriptionRequired: false,
    description: 'WHO-recommended oral rehydration formulation to restore body fluids and electrolytes lost during dehydration.',
    aliases: ['Electral', 'Walyte', 'Prolyte ORS'],
    createdAt: new Date(Date.now() - 100 * 86400000),
  },
  {
    _id: 'med_5',
    name: 'Ibuprofen 400',
    genericName: 'Ibuprofen 400mg',
    category: 'Pain Relief & Fever',
    dosageForm: 'Tablet',
    strength: '400 mg',
    manufacturer: 'Abbott (Brufen 400)',
    prescriptionRequired: false,
    description: 'Nonsteroidal anti-inflammatory drug (NSAID) used for pain, dental pain, swelling, and fever.',
    aliases: ['Brufen 400', 'Combiflam', 'Ibugesic 400'],
    createdAt: new Date(Date.now() - 100 * 86400000),
  },
  {
    _id: 'med_6',
    name: 'Pantoprazole 40',
    genericName: 'Pantoprazole Sodium 40mg',
    category: 'Gastrointestinal',
    dosageForm: 'Tablet',
    strength: '40 mg',
    manufacturer: 'Alkem (Pan 40)',
    prescriptionRequired: false,
    description: 'Proton-pump inhibitor that decreases the amount of acid produced in the stomach.',
    aliases: ['Pan 40', 'Pantocid 40', 'Pantodac 40'],
    createdAt: new Date(Date.now() - 100 * 86400000),
  },
  {
    _id: 'med_7',
    name: 'Amoxicillin 500',
    genericName: 'Amoxicillin Trihydrate 500mg',
    category: 'Antibiotics',
    dosageForm: 'Capsule',
    strength: '500 mg',
    manufacturer: 'GlaxoSmithKline (Mox 500)',
    prescriptionRequired: true,
    description: 'Penicillin-type antibiotic used to treat bacterial infections of ear, throat, chest, and skin.',
    aliases: ['Mox 500', 'Novamox 500', 'Amoxil'],
    createdAt: new Date(Date.now() - 100 * 86400000),
  },
];

// Inventory availability matrix with realistic freshness variations for demo
const nowMs = Date.now();
const inventories = [
  // Paracetamol 650 across pharmacies
  {
    _id: 'inv_1',
    pharmacy: 'pharm_1', // ABC Medical Store
    medicine: 'med_1',   // Paracetamol 650
    status: 'available',
    quantity: 120,
    unitPrice: 32,
    lastUpdated: new Date(nowMs - 8 * 60 * 1000), // 8 mins ago -> FRESH
    notes: 'Plenty in stock, 15-tablet strips',
  },
  {
    _id: 'inv_2',
    pharmacy: 'pharm_2', // HealthPlus
    medicine: 'med_1',   // Paracetamol 650
    status: 'available',
    quantity: 45,
    unitPrice: 30,
    lastUpdated: new Date(nowMs - 5 * 3600 * 1000), // 5 hours ago -> AGING
    notes: 'Available on rack B',
  },
  {
    _id: 'inv_3',
    pharmacy: 'pharm_3', // City Care
    medicine: 'med_1',   // Paracetamol 650
    status: 'low',
    quantity: 6,
    unitPrice: 33,
    lastUpdated: new Date(nowMs - 28 * 3600 * 1000), // 28 hours ago -> STALE
    notes: 'Last few strips remaining',
  },
  {
    _id: 'inv_4',
    pharmacy: 'pharm_4', // Lifeline Chemist
    medicine: 'med_1',   // Paracetamol 650
    status: 'out',
    quantity: 0,
    unitPrice: 30,
    lastUpdated: new Date(nowMs - 2 * 3600 * 1000),
    notes: 'Awaiting new shipment',
  },

  // Cetirizine 10
  {
    _id: 'inv_5',
    pharmacy: 'pharm_1',
    medicine: 'med_2',
    status: 'available',
    quantity: 80,
    unitPrice: 22,
    lastUpdated: new Date(nowMs - 25 * 60 * 1000), // 25 mins ago -> FRESH
  },
  {
    _id: 'inv_6',
    pharmacy: 'pharm_2',
    medicine: 'med_2',
    status: 'available',
    quantity: 110,
    unitPrice: 20,
    lastUpdated: new Date(nowMs - 45 * 60 * 1000),
  },

  // Azithromycin 500
  {
    _id: 'inv_7',
    pharmacy: 'pharm_1',
    medicine: 'med_3',
    status: 'available',
    quantity: 35,
    unitPrice: 115,
    lastUpdated: new Date(nowMs - 12 * 60 * 1000), // 12 mins ago -> FRESH
  },
  {
    _id: 'inv_8',
    pharmacy: 'pharm_3',
    medicine: 'med_3',
    status: 'low',
    quantity: 4,
    unitPrice: 120,
    lastUpdated: new Date(nowMs - 8 * 3600 * 1000),
  },

  // ORS
  {
    _id: 'inv_9',
    pharmacy: 'pharm_1',
    medicine: 'med_4',
    status: 'available',
    quantity: 200,
    unitPrice: 21,
    lastUpdated: new Date(nowMs - 15 * 60 * 1000),
  },
  {
    _id: 'inv_10',
    pharmacy: 'pharm_2',
    medicine: 'med_4',
    status: 'available',
    quantity: 150,
    unitPrice: 21,
    lastUpdated: new Date(nowMs - 2 * 3600 * 1000),
  },

  // Ibuprofen 400
  {
    _id: 'inv_11',
    pharmacy: 'pharm_1',
    medicine: 'med_5',
    status: 'available',
    quantity: 90,
    unitPrice: 28,
    lastUpdated: new Date(nowMs - 35 * 60 * 1000),
  },
  {
    _id: 'inv_12',
    pharmacy: 'pharm_2',
    medicine: 'med_5',
    status: 'low',
    quantity: 8,
    unitPrice: 28,
    lastUpdated: new Date(nowMs - 14 * 3600 * 1000),
  },

  // Pantoprazole 40
  {
    _id: 'inv_13',
    pharmacy: 'pharm_1',
    medicine: 'med_6',
    status: 'available',
    quantity: 140,
    unitPrice: 75,
    lastUpdated: new Date(nowMs - 40 * 60 * 1000),
  },
  {
    _id: 'inv_14',
    pharmacy: 'pharm_3',
    medicine: 'med_6',
    status: 'available',
    quantity: 60,
    unitPrice: 72,
    lastUpdated: new Date(nowMs - 3 * 3600 * 1000),
  },
];

const requests = [
  {
    _id: 'req_1',
    customer: 'user_cust_1',
    pharmacy: 'pharm_1',
    medicine: 'med_1',
    status: 'available',
    customerNote: 'Need 2 strips of Dolo/Paracetamol 650 urgently',
    pharmacistNote: 'Yes, fresh stock available behind counter',
    createdAt: new Date(nowMs - 18 * 60 * 1000),
    respondedAt: new Date(nowMs - 14 * 60 * 1000),
  },
  {
    _id: 'req_2',
    customer: 'user_cust_1',
    pharmacy: 'pharm_3',
    medicine: 'med_3',
    status: 'pending',
    customerNote: 'Is Azithromycin 500 3-tablet pack available?',
    pharmacistNote: '',
    createdAt: new Date(nowMs - 6 * 60 * 1000),
    respondedAt: null,
  },
];

const reservations = [
  {
    _id: 'res_1',
    customer: 'user_cust_1',
    pharmacy: 'pharm_1',
    medicine: 'med_1',
    quantity: 2,
    pickupCode: 'MC-8421',
    status: 'active',
    expiresAt: new Date(nowMs + 3 * 3600 * 1000), // expires in 3 hours
    collectedAt: null,
    createdAt: new Date(nowMs - 12 * 60 * 1000),
  },
];

const reports = [
  {
    _id: 'rep_1',
    customer: 'user_cust_1',
    pharmacy: 'pharm_1',
    medicine: 'med_1',
    result: 'available',
    comment: 'Visited and collected medicine within 10 minutes without waiting!',
    status: 'resolved',
    createdAt: new Date(nowMs - 86400000),
  },
];

module.exports = {
  users,
  pharmacies,
  medicines,
  inventories,
  requests,
  reservations,
  reports,
};
