const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

// Get all published blog posts
router.get('/', async (req, res) => {
  try {
    const posts = await Blog.find({ published: true }).sort({ publish_date: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get featured blog posts
router.get('/featured', async (req, res) => {
  try {
    const posts = await Blog.find({ published: true, featured: true }).limit(3);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single blog post
router.get('/:id', async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post || !post.published) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;