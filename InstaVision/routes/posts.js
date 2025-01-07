import express from 'express';
import { createPost, getPostsByUserId, addCommentToPost } from '../models/Post.js'; // Import the new functions
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import { generatePost } from '../services/aiService.js';

const router = express.Router();

// Create a post
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { content, imageUrl } = req.body;
    const userId = req.user.userId;
    const result = await createPost(userId, content, imageUrl);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Get posts by userId
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const posts = await getPostsByUserId(userId);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Generate a post (AI service)
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { prompt } = req.body;
    const generatedPost = await generatePost(prompt);
    res.json(generatedPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate post' });
  }
});

// Delete a post (admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const postId = req.params.id;
    const [result] = await pool.promise().query('DELETE FROM posts WHERE postId = ?', [postId]);
    res.json({ message: 'Post deleted successfully', result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

export default router;
