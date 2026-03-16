const Progress = require('../models/Progress');

const getProgressEntries = async (req, res) => {
  const entries = await Progress.find({ user: req.user._id }).sort({ loggedAt: -1 });
  res.status(200).json({ success: true, data: entries });
};

const createProgressEntry = async (req, res) => {
  const entry = await Progress.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, message: 'Progress entry created', data: entry });
};

const updateProgressEntry = async (req, res) => {
  const entry = await Progress.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { returnDocument: 'after', runValidators: true }
  );

  if (!entry) {
    return res.status(404).json({ success: false, message: 'Progress entry not found' });
  }

  res.status(200).json({ success: true, message: 'Progress entry updated', data: entry });
};

const deleteProgressEntry = async (req, res) => {
  const entry = await Progress.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!entry) {
    return res.status(404).json({ success: false, message: 'Progress entry not found' });
  }

  res.status(200).json({ success: true, message: 'Progress entry deleted' });
};

module.exports = {
  getProgressEntries,
  createProgressEntry,
  updateProgressEntry,
  deleteProgressEntry,
};
