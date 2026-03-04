const User = require('../models/User');

const updateProfile = async (req, res) => {
  const allowedFields = ['name', 'age', 'weight', 'height', 'goal', 'avatarUrl'];
  const updates = {};

  allowedFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      updates[field] = req.body[field];
    }
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  }).select('-password');

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: user,
  });
};

module.exports = { updateProfile };
