const { Pool } = require('pg');
require('dotenv').config();

let dbUrl = process.env.DATABASE_URL;

// Hapus parameter sslmode jika ada, karena node-pg akan mengabaikan ssl config jika parameter ini ada
if (dbUrl) {
  try {
    const parsedUrl = new URL(dbUrl);
    parsedUrl.searchParams.delete('sslmode');
    dbUrl = parsedUrl.toString();
  } catch (e) {
    dbUrl = dbUrl.replace(/[?&]sslmode=[^&]+/g, '');
  }
}

const isLocal = dbUrl && (dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1'));

const pool = new Pool({
  connectionString: dbUrl,
  ssl: isLocal ? false : { rejectUnauthorized: false },
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ PostgreSQL connected successfully');
    release();
  }
});

module.exports = pool;