const express = require('express');
const pool = require('./src/config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Uji koneksi sebelum server berjalan
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Error connecting to the database', err.stack);
    } else {
        console.log('✅ Database connected successfully:', res.rows[0].now);
    }
});

app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.send(`Server is running. Current time from DB: ${result.rows[0].now}`);
    } catch (error) {
        console.error('❌ Error executing query:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});