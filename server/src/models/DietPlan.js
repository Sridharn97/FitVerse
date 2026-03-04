const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema(
  {
    mealType: { type: String, required: true },
    items: [{ type: String, trim: true }],
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
  },
  { _id: false }
);

const dietPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    targetCalories: { type: Number, default: 0 },
    meals: [mealSchema],
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DietPlan', dietPlanSchema);
