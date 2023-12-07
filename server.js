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

// Handle form submission for creating a teacher
app.post('/api/teachers/create', (req, res) => {
  const formData = req.body;

  // Insert data into the 'teachers' table
  connection.query('INSERT INTO teachers SET ?', formData, (error, results) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).send('Internal Server Error');
    } else {
      res.send('Teacher created successfully');
    }
  });
});

// Handle form submission for updating a student
app.post('/api/students/update', (req, res) => {
  const studentId = req.body.sID; // Change to sID
  const formData = req.body;

  // Perform update logic here
  connection.query('UPDATE students SET ? WHERE sID = ?', [formData, studentId], (error, results) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).send('Internal Server Error');
    } else {
      res.send(`Update student with ID ${studentId} successful`);
    }
  });
});

// Handle request to get all students
app.get('/api/students', (req, res) => {
  // Fetch all students from the database
  connection.query('SELECT sID, firstName, lastName, email FROM students', (error, results) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('Students fetched successfully:', results);
      // Send the list of students as JSON response
      res.json(results);
    }
  });
});

// Handle request to get information about a specific student
app.get('/api/students/:studentId', (req, res) => {
  const studentId = req.params.studentId;

  // Fetch the student with the given ID from the database
  connection.query('SELECT * FROM students WHERE sID = ?', studentId, (error, results) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: 'Student not found' });
      } else {
        console.log(`Student with ID ${studentId} fetched successfully:`, results[0]);
        // Send the student information as JSON response
        res.json(results[0]);
      }
    }
  });
});

// Handle form submission for deleting a student
app.post('/api/students/delete', (req, res) => {
  const studentId = req.body.studentId;

  // Delete the student by ID using a parameterized query
  const deleteQuery = 'DELETE FROM students WHERE sID = ?';

  // Perform the deletion
  connection.query(deleteQuery, [studentId], (error, results) => {
    if (error) {
      console.error('Error deleting student:', error);
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send(`Student with ID ${studentId} deleted successfully`);
    }
  });
});

// Handle form submission for searching a student
app.post('/api/students/search', (req, res) => {
  const studentId = req.body.studentId;

  // Search for the student by ID using a parameterized query
  const searchQuery = 'SELECT * FROM students WHERE sID = ?';

  // Perform the search
  connection.query(searchQuery, [studentId], (error, results) => {
    if (error) {
      console.error('Error searching for student:', error);
      res.status(500).send('Internal Server Error');
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: 'Student not found' });
      } else {
        console.log(`Student with ID ${studentId} found:`, results[0]);
        // Send the student information as JSON response
        res.json(results[0]);
      }
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
