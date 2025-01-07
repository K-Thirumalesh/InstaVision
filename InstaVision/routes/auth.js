import express from 'express';
import jwt from 'jsonwebtoken';
import { createUser, comparePassword, findUserByEmail } from '../models/User.js';  // Named imports

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create a new user
    await createUser(username, email, password);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await findUserByEmail(email);
    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Send response with token and user details
    res.json({ token, userId: user.id, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
