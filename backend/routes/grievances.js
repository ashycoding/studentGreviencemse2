const express = require('express');
const router = express.Router();
const Grievance = require('../models/Grievance');
const { protect } = require('../middleware/authMiddleware');

// @route GET /api/grievances/search?title=xyz
router.get('/search', protect, async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) {
      return res.status(400).json({ message: 'Search title query parameter is required' });
    }
    const grievances = await Grievance.find({
      user: req.user.id,
      title: { $regex: title, $options: 'i' }
    });
    res.status(200).json(grievances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/grievances
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, category } = req.body;
    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }
    const grievance = await Grievance.create({
      title,
      description,
      category,
      user: req.user.id,
    });
    res.status(201).json(grievance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/grievances
router.get('/', protect, async (req, res) => {
  try {
    const grievances = await Grievance.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(grievances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/grievances/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }
    // Check for user
    if (grievance.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    res.status(200).json(grievance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/grievances/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }
    // Check for user
    if (grievance.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    const updatedGrievance = await Grievance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedGrievance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route DELETE /api/grievances/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }
    // Check for user
    if (grievance.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    await Grievance.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
