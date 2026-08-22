const mongoose = require('mongoose');

const pharmacySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide the pharmacy name'],
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide the pharmacy contact number'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Please provide the physical address'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Please provide the city'],
      default: 'Mumbai',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        default: [72.8777, 19.0760],
      },
    },
    openingHours: {
      type: String,
      default: '8:00 AM - 10:00 PM',
    },
    licenseNumber: {
      type: String,
      default: 'DL-MH-2024-001',
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'suspended'],
      default: 'verified',
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    totalConfirmations: {
      type: Number,
      default: 0,
    },
    unavailableReports: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

pharmacySchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Pharmacy', pharmacySchema);
