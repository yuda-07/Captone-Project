// =====================================================
// MicroCred AI - Backend (Express.js)
// Struktur folder:
//
// microcred-backend/
// ├── src/
// │   ├── config/
// │   │   └── db.js
// │   ├── middleware/
// │   │   └── authMiddleware.js
// │   ├── routes/
// │   │   ├── authRoutes.js
// │   │   └── predictRoutes.js
// │   ├── controllers/
// │   │   ├── authController.js
// │   │   └── predictController.js
// │   └── app.js
// ├── .env
// └── package.json
// =====================================================

// ─── .env ────────────────────────────────────────────
/*
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/microcred_ai
JWT_SECRET=your_jwt_secret_key_here
AI_INFERENCE_URL=http://localhost:5000/predict
*/

// ─── package.json dependencies ───────────────────────
/*
npm init -y
npm install express pg bcrypt jsonwebtoken dotenv cors axios
npm install --save-dev nodemon
*/

// =====================================================
// src/config/db.js
// =====================================================
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect((err) => {
  if (err) console.error('❌ Database connection failed:', err.message);
  else console.log('✅ Connected to PostgreSQL');
});

module.exports = pool;

// =====================================================
// src/app.js
// =====================================================
const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const authRoutes    = require('./routes/authRoutes');
const predictRoutes = require('./routes/predictRoutes');

const app  = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth',    authRoutes);
app.use('/predict', predictRoutes);

// Health check
app.get('/', (req, res) => res.json({ message: '🚀 MicroCred AI Backend is running' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// =====================================================
// src/routes/authRoutes.js
// =====================================================
const router      = require('express').Router();
const authCtrl    = require('../controllers/authController');

router.post('/register', authCtrl.register);
router.post('/login',    authCtrl.login);

module.exports = router;

// =====================================================
// src/routes/predictRoutes.js
// =====================================================
const router      = require('express').Router();
const predictCtrl = require('../controllers/predictController');
const { protect } = require('../middleware/authMiddleware');

// protect = harus login dulu (JWT)
router.post('/',          protect, predictCtrl.predict);
router.get('/history',    protect, predictCtrl.history);

module.exports = router;

// =====================================================
// src/middleware/authMiddleware.js
// =====================================================
const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ error: 'Unauthorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email }
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// =====================================================
// src/controllers/authController.js
// =====================================================
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const pool   = require('../config/db');

// POST /auth/register
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Semua field wajib diisi' });

  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3) RETURNING id, name, email, created_at`,
      [name, email, hashed]
    );

    // Catat ke audit_log
    await pool.query(
      `INSERT INTO audit_log (user_id, action, details)
       VALUES ($1, $2, $3)`,
      [result.rows[0].id, 'REGISTER', `User ${email} registered`]
    );

    res.status(201).json({ message: 'Registrasi berhasil', user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') // unique violation
      return res.status(409).json({ error: 'Email sudah terdaftar' });
    res.status(500).json({ error: err.message });
  }
};

// POST /auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email dan password wajib diisi' });

  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1`, [email]
    );
    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Password salah' });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Catat ke audit_log
    await pool.query(
      `INSERT INTO audit_log (user_id, action, details)
       VALUES ($1, $2, $3)`,
      [user.id, 'LOGIN', `User ${email} login`]
    );

    res.json({ message: 'Login berhasil', token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =====================================================
// src/controllers/predictController.js
// =====================================================
const axios = require('axios');
const pool  = require('../config/db');

// POST /predict
exports.predict = async (req, res) => {
  const {
    nama_usaha,
    usia_pemilik,
    lama_usaha,
    pendapatan_bulanan,
    pengeluaran_bulanan,
    jumlah_pinjaman,
    riwayat_telat_bayar = 0,
    jumlah_tanggungan   = 0,
  } = req.body;

  // Validasi field wajib
  if (!nama_usaha || !pendapatan_bulanan || !pengeluaran_bulanan || !jumlah_pinjaman)
    return res.status(400).json({ error: 'Field wajib tidak lengkap' });

  try {
    // 1. Forward ke AI Inference API (tim AI)
    const aiResponse = await axios.post(process.env.AI_INFERENCE_URL, {
      usia_pemilik,
      lama_usaha,
      pendapatan_bulanan,
      pengeluaran_bulanan,
      jumlah_pinjaman,
      riwayat_telat_bayar,
      jumlah_tanggungan,
    });

    const { score, status } = aiResponse.data;

    // 2. Simpan hasil ke database
    const saved = await pool.query(
      `INSERT INTO predictions
         (user_id, nama_usaha, usia_pemilik, lama_usaha, pendapatan_bulanan,
          pengeluaran_bulanan, jumlah_pinjaman, riwayat_telat_bayar,
          jumlah_tanggungan, score, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [
        req.user.id, nama_usaha, usia_pemilik, lama_usaha,
        pendapatan_bulanan, pengeluaran_bulanan, jumlah_pinjaman,
        riwayat_telat_bayar, jumlah_tanggungan, score, status
      ]
    );

    // 3. Catat ke audit_log
    await pool.query(
      `INSERT INTO audit_log (user_id, action, details)
       VALUES ($1, $2, $3)`,
      [req.user.id, 'PREDICT', `Prediksi untuk usaha: ${nama_usaha}, score: ${score}`]
    );

    res.json({ message: 'Prediksi berhasil', prediction: saved.rows[0] });
  } catch (err) {
    // Jika AI Inference belum siap, kembalikan mock response sementara
    if (err.code === 'ECONNREFUSED') {
      console.warn('⚠️  AI Inference API belum tersedia, menggunakan mock response');
      return res.json({
        message: 'Prediksi berhasil (mock)',
        prediction: { score: 750, status: 'Layak', nama_usaha }
      });
    }
    res.status(500).json({ error: err.message });
  }
};

// GET /predict/history
exports.history = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM predictions
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json({ history: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};