import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config({ path: './final.env' });

const db = mysql.createConnection({
  host: process.env.VV_HOST,
  user: process.env.VV_USER,
  password: process.env.VV_PASSWORD,
  database: process.env.VV_NAME,
  port: 3306
});

db.connect(err => {
  if (err) {
    console.error('Could not connect to the database:', err);
    process.exit(1);
  }
  else{
    console.log('Connected to the database');
  }
});

export default db;