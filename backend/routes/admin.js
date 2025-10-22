const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');
const Package = require('../models/Package');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const Booking = require('../models/Booking');

// Admin authentication middleware (basic implementation)
const adminAuth = (req, res, next) => {
  // In a real app, you'd use JWT or sessions
  const authHeader = req.headers.authorization;
  if (authHeader === 'admin-secret-key') {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Apply auth to all admin routes
router.use(adminAuth);

// Destination management
router.post('/destinations', async (req, res) => {
  try {
    const destination = new Destination(req.body);
    await destination.save();
    res.status(201).json(destination);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/destinations/:id', async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(destination);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/destinations/:id', async (req, res) => {
  try {
    await Destination.findByIdAndDelete(req.params.id);
    res.json({ message: 'Destination deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Package management
router.post('/packages', async (req, res) => {
  try {
    const package = new Package(req.body);
    await package.save();
    res.status(201).json(package);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/packages/:id', async (req, res) => {
  try {
    const package = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(package);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/packages/:id', async (req, res) => {
  try {
    await Package.findByIdAndDelete(req.params.id);
    res.json({ message: 'Package deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Blog management
router.post('/blog', async (req, res) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/blog/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/blog/:id', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Comment management
router.get('/comments', async (req, res) => {
  try {
    const comments = await Comment.find().sort({ created_at: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/comments/:id/approve', async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    res.json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/comments/:id', async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Booking management
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('package').sort({ created_at: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/bookings/:id/status', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate('package');
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;