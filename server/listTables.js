import dotenv from 'dotenv';
import mysql from 'mysql2';

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect(err => {
  if (err) {
    console.error('Could not connect to the database:', err);
    return;
  }
  console.log('Connected to the database');

  const query = `SHOW TABLES`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Failed to retrieve tables:', err);
      return;
    }

    console.log('Tables in the database:');
    results.forEach(result => {
      console.log(result);
    });

    connection.end();
  });
});



