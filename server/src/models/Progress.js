const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    weight: { type: Number, required: true },
    bodyFat: { type: Number, default: null },
    muscleMass: { type: Number, default: null },
    chest: { type: Number, default: null },
    waist: { type: Number, default: null },
    arms: { type: Number, default: null },
    hips: { type: Number, default: null },
    notes: { type: String, default: '' },
    loggedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Progress', progressSchema);
