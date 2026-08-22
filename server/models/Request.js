const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ['pending', 'available', 'not_available', 'cancelled'],
      default: 'pending',
    },
    customerNote: {
      type: String,
      default: 'Inquiring availability before traveling',
    },
    pharmacistNote: {
      type: String,
      default: '',
    },
    respondedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Request', requestSchema);
