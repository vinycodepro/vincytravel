const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// Get approved comments for a page
router.get('/:page', async (req, res) => {
  try {
    const comments = await Comment.find({ 
      page: req.params.page, 
      approved: true 
    }).sort({ created_at: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new comment
router.post('/', async (req, res) => {
  try {
    const comment = new Comment(req.body);
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;