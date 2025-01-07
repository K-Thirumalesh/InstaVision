import express, { json } from 'express';
import mysql from 'mysql2';
import { config } from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';

// Load environment variables from .env file
config();

const app = express();

// Middleware
app.use(cors());
app.use(json());

// MySQL Database Connection
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: 3306,
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
