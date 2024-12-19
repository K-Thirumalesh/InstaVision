import express from 'express';
import Post from '../models/Post.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import { generatePost } from '../services/aiService.js';

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { content, imageUrl } = req.body;
    const post = new Post({ user: req.user.userId, content, imageUrl });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate('user', 'username');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { prompt } = req.body;
    const generatedPost = await generatePost(prompt);
    res.json(generatedPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate post' });
  }
});

router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

export default router;

