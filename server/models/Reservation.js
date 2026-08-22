const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    pharmacy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pharmacy',
      required: true,
      index: true,
    },
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicine',
      required: true,
      index: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
      max: 10,
    },
    pickupCode: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'collected', 'cancelled', 'expired'],
      default: 'active',
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    collectedAt: {
      type: Date,
      default: null,
    },
    cancellationReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Reservation', reservationSchema);
