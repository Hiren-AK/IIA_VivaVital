import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

connection.connect(err => {
  if (err) {
    console.error('Could not connect to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});