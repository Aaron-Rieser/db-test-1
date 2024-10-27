const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Database connection configuration
const pool = new Pool({
    user: "postgres",
    password: "Fifthestate",
    host: "localhost",
    port: 5432,
    database: "DealCarte"
});

// Function to insert data into the table
async function insertData(neighbourhood, username, content) {
    const query = 'INSERT INTO "DealCarte Two" (neighbourhood, username, content) VALUES ($1, $2, $3)';
    const values = [neighbourhood, username, content];

    const client = await pool.connect();
    try {
        await client.query(query, values);
        console.log('Data inserted successfully');
        return true;
    } catch (err) {
        console.error('Error inserting data:', err);
        return false;
    } finally {
        client.release();
    }
}

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to handle form submission
app.post('/submit', async (req, res) => {
    console.log('Form submitted:', req.body);  // Log the form data
    const { neighbourhood, username, content } = req.body;
    
    const result = await insertData(neighbourhood, username, content);
    
    if (result) {
        res.send('Data submitted successfully!');
    } else {
        res.status(500).send('Error submitting data. Please try again.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Closing database pool...');
    await pool.end();
    console.log('Database pool closed.');
    process.exit(0);
});