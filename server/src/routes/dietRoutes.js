const express = require('express');
const { body } = require('express-validator');

const {
  getMeals,
  createMeal,
  deleteMeal,
  getGoal,
  setGoal,
} = require('../controllers/dietController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router
  .route('/meals')
  .get(protect, getMeals)
  .post(
    protect,
    [
      body('name').trim().notEmpty().withMessage('Meal name is required'),
      body('calories').isNumeric().withMessage('Calories must be a number'),
    ],
    validateRequest,
    createMeal
  );

router.route('/meals/:id').delete(protect, deleteMeal);

router.route('/goal').get(protect, getGoal).put(
  protect,
  [
    body('type').isIn(['weight_loss', 'muscle_gain', 'maintenance']).withMessage('Invalid goal type'),
    body('targetCalories').isNumeric().withMessage('Target calories must be a number'),
  ],
  validateRequest,
  setGoal
);

module.exports = router;
