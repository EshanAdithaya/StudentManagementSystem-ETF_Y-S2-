const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'studentmanagementsystem',
});

// Connect to the MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Serve static files from the root directory
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));

// Handle form submission
app.post('/api/students/create', (req, res) => {
  const formData = req.body;

  // Insert data into the 'students' table
  connection.query('INSERT INTO students SET ?', formData, (error, results) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).send('Internal Server Error');
    } else {
      res.send('Student created successfully');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  connection.end();
  process.exit();
});
