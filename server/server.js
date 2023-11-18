import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import userRoutes from './path/to/userRoutes.js';  // Update the path as necessary

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse incoming JSON requests
app.use(bodyParser.json());

// Middleware to parse JSON bodies
app.use(express.json());

// Use the routes
app.use(userRoutes);

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Route to handle incoming data
app.post('/api/uploadData', (req, res) => {
  const healthData = req.body;
  console.log('Received health data:', healthData);

  // TODO: Process and store the data as needed
  // ...

  res.send('Data received successfully');
});

// Start the server
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
