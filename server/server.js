const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse incoming JSON requests
app.use(bodyParser.json());

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
const PORT = 8001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
