const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Uji koneksi saat aplikasi dimulai
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Error connecting to the database', err.stack);
    } else {
        console.log('✅ Database connected successfully.');
    }
});

module.exports = pool;