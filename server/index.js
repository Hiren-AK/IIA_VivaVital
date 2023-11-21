import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2';
import userRoutes from './routes/userRoutes.js'; // Ensure this path is correct
import db from './db.js'; // Import the db connection from db.js
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from "ws";

dotenv.config();

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());

app.use(userRoutes); 

// Set up WebSocket server
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  
  ws.on('message', message => {
    try {
      // Assuming the message is a JSON string
      const data = JSON.parse(message);
      console.log('Received JSON data:', data);
      
      saveDataToDatabase(data);


      // Send this data to all connected WebSocket clients
      wss.clients.forEach(client => {
        if (client.readyState === ws.OPEN) {
          client.send(JSON.stringify(data));
          console.log('Sent data to client:', data);
        }
      });

    } catch (error) {
      console.error('Error parsing JSON message:', error);
      // Handle non-JSON messages or parsing errors
    }
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });

  ws.send(JSON.stringify({ message: 'WebSocket connection established with frontend.' }));
});

db.connect(err => {
  if (err) {
    console.error('Could not connect to the database:', err);
    process.exit(1);  // Exit if there is a connection error
  } else {
    console.log('Connected to the database');
  }
});

// Define __dirname in ES module scope
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../client/build')));

// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

function saveDataToDatabase(data) {
  const { userId, date, stepsToday, stepsWeek, stepsTotal, distanceToday, distanceWeek, distanceTotal, caloriesToday, caloriesWeek, caloriesTotal, sleepToday, sleepWeek, sleepTotal } = data;
  
  // Insert the data into the Health_Metrics table
  const sql = `
    INSERT INTO Health_Metrics (UserID, Date, stepsToday, stepsWeek, stepsTotal, distanceToday, distanceWeek, distanceTotal, caloriesToday, caloriesWeek, caloriesTotal, sleepToday, sleepWeek, sleepTotal)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const values = [userId, date, stepsToday, stepsWeek, stepsTotal, distanceToday, distanceWeek, distanceTotal, caloriesToday, caloriesWeek, caloriesTotal, sleepToday, sleepWeek, sleepTotal];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting data into the database:', err);
    } else {
      console.log('Data inserted into the database:', result);
    }
  });
}



// Integrate WebSocket with the existing HTTP server
server.on('upgrade', (request, socket, head) => {
  console.log('Upgrading to WebSocket...');
  wss.handleUpgrade(request, socket, head, socket => {
    wss.emit('connection', socket, request);
  });
});

// Start the server
const PORT = process.env.PORT || 8001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

