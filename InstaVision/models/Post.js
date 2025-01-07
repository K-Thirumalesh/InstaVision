import mysql2 from 'mysql2'; // Import mysql2

// Create a connection pool (replace with your MySQL connection details)
const pool = mysql2.createPool({
  host: 'localhost',
  user: 'root',
  password: 'admin',  // Replace with your database password
  database: 'mydb',   // Replace with your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Function to create a new post
const createPost = async (userId, content, imageUrl) => {
  const [result] = await pool.promise().query(
    'INSERT INTO posts (userId, content, imageUrl, likes) VALUES (?, ?, ?, ?)',
    [userId, content, imageUrl || null, 0]  // Default likes to 0, imageUrl can be optional
  );
  return result;
};

// Function to get posts for a specific user
const getPostsByUserId = async (userId) => {
  const [posts] = await pool.promise().query(
    'SELECT * FROM posts WHERE userId = ?',
    [userId]
  );
  return posts;
};

// Function to add a comment to a post (for example)
const addCommentToPost = async (postId, commentId) => {
  const [result] = await pool.promise().query(
    'UPDATE posts SET comments = JSON_ARRAY_APPEND(comments, "$", ?) WHERE postId = ?',
    [commentId, postId]
  );
  return result;
};

export { createPost, getPostsByUserId, addCommentToPost };
