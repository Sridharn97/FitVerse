const MealLog = require('../models/MealLog');
const DietGoal = require('../models/DietGoal');
const DietPlan = require('../models/DietPlan');

const getMeals = async (req, res) => {
  const meals = await MealLog.find({ user: req.user._id }).sort({ date: -1 });
  res.status(200).json({ success: true, data: meals });
};

const createMeal = async (req, res) => {
  const meal = await MealLog.create({ ...req.body, user: req.user._id });

  await DietPlan.findOneAndUpdate(
    { user: req.user._id },
    {
      $setOnInsert: {
        user: req.user._id,
        title: 'My Diet Plan',
      },
      $push: {
        meals: {
          mealType: meal.mealType,
          items: [meal.name],
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat,
        },
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.status(201).json({ success: true, message: 'Meal logged', data: meal });
};

const deleteMeal = async (req, res) => {
  const meal = await MealLog.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!meal) {
    return res.status(404).json({ success: false, message: 'Meal not found' });
  }

  res.status(200).json({ success: true, message: 'Meal deleted' });
};

const getGoal = async (req, res) => {
  const goal = await DietGoal.findOne({ user: req.user._id });
  res.status(200).json({ success: true, data: goal });
};

const setGoal = async (req, res) => {
  const { type, targetCalories } = req.body;

  const goal = await DietGoal.findOneAndUpdate(
    { user: req.user._id },
    { type, targetCalories },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );

  await DietPlan.findOneAndUpdate(
    { user: req.user._id },
    {
      $set: {
        targetCalories,
        notes: `Goal type: ${type}`,
      },
      $setOnInsert: {
        user: req.user._id,
        title: 'My Diet Plan',
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.status(200).json({ success: true, message: 'Goal saved', data: goal });
};

module.exports = { getMeals, createMeal, deleteMeal, getGoal, setGoal };
