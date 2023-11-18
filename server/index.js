import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2';
import userRoutes from './routes/userRoutes.js'; // Ensure this path is correct
import db from './db.js'; // Import the db connection from db.js

const app = express();
app.use(cors());
app.use(express.json()); // This replaces bodyParser.json()

app.use(userRoutes); // Use your user routes

db.connect(err => {
  if (err) {
    console.error('Could not connect to the database:', err);
    process.exit(1);  // Exit if there is a connection error
  } else {
    console.log('Connected to the database');
  }
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