import bcrypt from 'bcrypt';
import db from '../db.js';
import mysql from 'mysql2/promise';


const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send('Please provide username, email, and password');
  }

  if (!validateEmail(email)) {
    return res.status(400).send('Invalid email format');
  }

  if (password.length < 8) {
    return res.status(400).send('Password must be at least 8 characters long');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertQuery = 'INSERT INTO Users (Username, Email, PasswordHash) VALUES (?, ?, ?)';
    await db.promise().query(insertQuery, [username, email, hashedPassword]);

    const selectQuery = 'SELECT UserID FROM Users WHERE Email = ?';
    const [users] = await db.promise().query(selectQuery, [email]);

    if (users.length > 0) {
      const userID = users[0].UserID;
      res.status(201).json({ message: 'User registered successfully', userId: userID });
    } else {
      res.status(500).send('Error retrieving user ID');
    }
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).send('Email already in use. Please choose another email');
    } else {
      console.error('Server error:', err.message);
      res.status(500).send('Server error: ' + err.message);
    }
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Please provide email and password');
  }

  try {
    const query = 'SELECT UserID, PasswordHash FROM Users WHERE Email = ?';
    const [rows] = await db.promise().query(query, [email]);

    if (rows.length === 0) {
      return res.status(401).send('Invalid email or password');
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) {
      return res.status(401).send('Invalid email or password');
    }

    res.status(200).json({ message: 'User logged in successfully', userId: user.UserID });
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error: ' + err.message);
  }
};

const insertDemographics = async (req, res) => {
  const { userId, birthdate, gender, weight, height } = req.body;

  try {
    await db.execute(`
      INSERT INTO Demographics (UserID, Birthdate, Gender, Weight, Height)
      VALUES (?, ?, ?, ?, ?)
    `, [userId, birthdate, gender, weight, height]);

    res.status(200).send('Demographic data added successfully');
  } catch (err) {
    console.error('Server error:', err.message); // Log detailed error message
    res.status(500).send('Server error: ' + err.message); // Optionally send the error message in response for debugging
  }
};

export { registerUser, loginUser, insertDemographics };


// function get_UserID(email, callback){
      
//   var sql = "SELECT UserID from Users where Email = ?";

//   db.query(sql, function(err, results){
//         if (err){ 
//           throw err;
//         }
//         console.log(results[0].objid); // good
//         stuff_i_want = results[0].objid;  // Scope is larger than function

//         return callback(results[0].objid);
// })
// }


// //usage

// var stuff_i_want = '';

// get_info(parm, function(result){
// stuff_i_want = result;

// //rest of your code goes in here
// });