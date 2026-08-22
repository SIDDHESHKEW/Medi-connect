const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
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
      enum: ['available', 'low', 'out'],
      default: 'available',
      required: true,
    },
    quantity: {
      type: Number,
      default: null, // Optional for low-friction pharmacy workflow
    },
    unitPrice: {
      type: Number,
      default: null, // Optional informative reference
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

inventorySchema.index({ pharmacy: 1, medicine: 1 }, { unique: true });

module.exports = mongoose.model('Inventory', inventorySchema);
