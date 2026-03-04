const express = require('express');

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const workoutRoutes = require('./workoutRoutes');
const dietRoutes = require('./dietRoutes');
const progressRoutes = require('./progressRoutes');
const communityRoutes = require('./communityRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/workouts', workoutRoutes);
router.use('/diet', dietRoutes);
router.use('/progress', progressRoutes);
router.use('/community', communityRoutes);

module.exports = router;
