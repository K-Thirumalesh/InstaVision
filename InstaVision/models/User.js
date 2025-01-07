import mysql2 from 'mysql2';  // Import mysql2
import bcrypt from 'bcryptjs'; // Import bcryptjs for password hashing

// Create a MySQL connection pool
const pool = mysql2.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

// Function to create a new user
const createUser = async (username, email, password) => {
  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 12);

  // SQL query to insert a new user
  const query = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
  const values = [username, email, hashedPassword, 'user']; // Default role is 'user'

  return new Promise((resolve, reject) => {
    pool.query(query, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Function to compare a password (for login)
const comparePassword = async (inputPassword, hashedPassword) => {
  return await bcrypt.compare(inputPassword, hashedPassword);
};

// Function to fetch user by email
const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
      if (err) return reject(err);
      resolve(result[0]); // Return the first user found
    });
  });
};

export { createUser, comparePassword, findUserByEmail };
