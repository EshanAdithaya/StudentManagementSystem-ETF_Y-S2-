const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const PORT = 3000;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'studentmanagementsystem',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Serve static files from the root directory
app.use(express.static(__dirname));

// Define routes to fetch data from your database

app.get('/api/students', (req, res) => {
  connection.query('SELECT * FROM students', (error, results) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
});

app.get('/api/students/:id', (req, res) => {
  const studentId = req.params.id;
  connection.query('SELECT * FROM students WHERE sID = ?', [studentId], (error, results) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).send('Internal Server Error');
    } else if (results.length === 0) {
      res.status(404).send('Student not found');
    } else {
      res.json(results[0]);
    }
  });
});

// New route to serve the login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  connection.end();
  process.exit();
});
