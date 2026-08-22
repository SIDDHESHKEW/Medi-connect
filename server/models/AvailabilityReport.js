const mongoose = require('mongoose');

const availabilityReportSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
    result: {
      type: String,
      enum: ['available', 'unavailable'],
      required: true,
    },
    comment: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending_review', 'resolved', 'dismissed'],
      default: 'resolved',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AvailabilityReport', availabilityReportSchema);
