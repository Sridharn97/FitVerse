const express = require('express');
const { body } = require('express-validator');

const {
  getWorkouts,
  createWorkout,
  updateWorkout,
  deleteWorkout,
} = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router
  .route('/')
  .get(protect, getWorkouts)
  .post(
    protect,
    [body('title').trim().notEmpty().withMessage('Workout title is required')],
    validateRequest,
    createWorkout
  );

router.route('/:id').put(protect, updateWorkout).delete(protect, deleteWorkout);

module.exports = router;
