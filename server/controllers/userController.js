import bcrypt from 'bcrypt';
import db from '../db.js';

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  // Basic Validation
  if (!username || !email || !password) {
    return res.status(400).send('Please provide username, email, and password');
  }

  if (!validateEmail(email)) {
    return res.status(400).send('Invalid email format. Please provide a valid email address');
  }

  if (password.length < 8) {
    return res.status(400).send('Password must be at least 8 characters long');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO Users (Username, Email, PasswordHash) VALUES (?, ?, ?)';
    
    db.execute(query, [username, email, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).send('Email already in use. Please choose another email');
        }
        return res.status(500).send('Error registering new user');
      }
      res.status(201).send('User registered successfully');
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Please provide email and password');
  }

  const query = 'SELECT UserID, PasswordHash FROM Users WHERE Email = ?';
  
  db.execute(query, [email], async (err, users) => {
    if (err) {
      return res.status(500).send('Error logging in');
    }
    if (users.length === 0) {
      return res.status(401).send('Invalid email or password');
    }

    try {
      const user = users[0];
      const isMatch = await bcrypt.compare(password, user.PasswordHash);
      if (!isMatch) {
        return res.status(401).send('Invalid email or password');
      }
      res.status(200).send('User logged in successfully');
    } catch (err) {
      res.status(500).send('Server error');
    }
  });
};

export { registerUser, loginUser };
