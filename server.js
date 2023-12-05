// server.js

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Handle signup POST request
app.post('/signup', (req, res) => {
    // Process signup data here (insert into the 'users' table)
    const userData = req.body;
    // Implement your database logic to insert userData into the 'users' table

    // Respond with a JSON message
    res.json({ message: 'Signup successful' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
