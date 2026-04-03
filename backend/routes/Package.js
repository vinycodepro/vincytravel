import express from 'express';
const router = express.Router();
import Package from '../models/Package.js';

// Get all packages
router.get('/', async (req, res) => {
  try {
    const packages = await Package.find().populate('destinations').sort({ created_at: -1 });
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }7
});

// Get featured packages
router.get('/featured', async (req, res) => {
  try {
    const packages = await Package.find({ featured: true }).populate('destinations').limit(3);
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single package
router.get('/:id', async (req, res) => {
  try {
    const tourpackage = await Package.findById(req.params.id).populate('destinations');
    if (!tourpackage) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.json(tourpackage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;