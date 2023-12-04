const express = require('express');
const mysql = require('mysql2');
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

// Define routes to fetch data from your database

// Get all students
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

// Get a specific student by ID
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

// Similarly, you can define routes for other tables (teachers, attendance, classes) as needed

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  connection.end();
  process.exit();
});
