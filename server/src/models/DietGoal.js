const mongoose = require('mongoose');

const dietGoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['weight_loss', 'muscle_gain', 'maintenance'],
      default: 'maintenance',
    },
    targetCalories: { type: Number, required: true },
    trackingMode: {
      type: String,
      enum: ['static', 'daily'],
      default: 'static',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DietGoal', dietGoalSchema);
