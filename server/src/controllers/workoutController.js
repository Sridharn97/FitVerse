const Workout = require('../models/Workout');

const getWorkouts = async (req, res) => {
  const workouts = await Workout.find({ user: req.user._id }).sort({ date: -1 });
  res.status(200).json({ success: true, data: workouts });
};

const createWorkout = async (req, res) => {
  const workout = await Workout.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, message: 'Workout created', data: workout });
};

const updateWorkout = async (req, res) => {
  const workout = await Workout.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!workout) {
    return res.status(404).json({ success: false, message: 'Workout not found' });
  }

  res.status(200).json({ success: true, message: 'Workout updated', data: workout });
};

const deleteWorkout = async (req, res) => {
  const workout = await Workout.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!workout) {
    return res.status(404).json({ success: false, message: 'Workout not found' });
  }

  res.status(200).json({ success: true, message: 'Workout deleted' });
};

module.exports = { getWorkouts, createWorkout, updateWorkout, deleteWorkout };
