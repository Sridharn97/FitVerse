const express = require('express');
const { body } = require('express-validator');

const {
  getProgressEntries,
  createProgressEntry,
  updateProgressEntry,
  deleteProgressEntry,
} = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router
  .route('/')
  .get(protect, getProgressEntries)
  .post(
    protect,
    [body('weight').isNumeric().withMessage('Weight is required and must be a number')],
    validateRequest,
    createProgressEntry
  );

router.route('/:id').put(protect, updateProgressEntry).delete(protect, deleteProgressEntry);

module.exports = router;
