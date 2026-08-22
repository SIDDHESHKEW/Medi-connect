const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide medicine brand name'],
      trim: true,
      index: true,
    },
    genericName: {
      type: String,
      required: [true, 'Please provide generic formulation name'],
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Pain Relief & Fever',
        'Antibiotics',
        'Allergy & Respiratory',
        'Gastrointestinal',
        'Cardiovascular',
        'Diabetes',
        'First Aid & Rehydration',
        'Vitamins & Supplements',
        'Skin & Topical',
        'General Healthcare',
      ],
      default: 'General Healthcare',
    },
    dosageForm: {
      type: String,
      default: 'Tablet',
      enum: ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Sachet', 'Drops', 'Inhaler'],
    },
    strength: {
      type: String,
      default: '',
    },
    manufacturer: {
      type: String,
      default: 'Generic Pharma',
    },
    prescriptionRequired: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      default: '',
    },
    aliases: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

medicineSchema.index({ name: 'text', genericName: 'text', aliases: 'text' });

module.exports = mongoose.model('Medicine', medicineSchema);
