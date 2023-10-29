const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/uploadData', (req, res) => {
  console.log('Data received:', req.body);
  // Here, you would typically store the data in a database.
  res.send('Data received!');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});