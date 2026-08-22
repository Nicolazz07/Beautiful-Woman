const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'beautiful_woman_db'
});

db.getConnection()
    .then(conn => {
        console.log('✅ Conectado a MySQL');
        conn.release();
    })
    .catch(err => console.error('❌ Error MySQL:', err.message));

module.exports = db;