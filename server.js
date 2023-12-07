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

// Handle form submission for creating a student
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

// Handle form submission for updating a student
app.post('/api/students/update', (req, res) => {
  const studentId = req.body.studentId;
  const formData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.telephone,
    dateOfBirth: req.body.dateOfBirth,
    district: req.body.district,
    course: req.body.course,
    guardian: req.body.guardian,
    emergencyContact: req.body.emergencyContact,
    additionalInfo: req.body.additionalInfo,
    profilePicture: req.body.profilePicture,
  };

  // Update the student in the 'students' table
  connection.query('UPDATE students SET ? WHERE sID = ?', [formData, studentId], (error, results) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).send('Internal Server Error');
    } else {
      res.send(`Update student with ID ${studentId} successful`);
    }
  });
});

// Handle request to get teachers
app.get('/api/teachers', (req, res) => {
  // Fetch teachers from the database
  connection.query('SELECT id, name FROM teachers', (error, results) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('Teachers fetched successfully:', results);
      // Send the list of teachers as JSON response
      res.json(results);
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
