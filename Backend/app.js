const express = require('express');
const cors    = require('cors');
require('dotenv').config();

// Import routes
const authRoutes    = require('./routes/authRoutes');
const predictRoutes = require('./routes/predictRoutes');

// Import middleware
const { errorHandler } = require('./middlewares/errorMiddleware');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── CORS ──────────────────────────────────────────────
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────
app.use('/auth',    authRoutes);
app.use('/predict', predictRoutes);

// ─── Health Check ─────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 MicroCred AI Backend is running',
    version: '1.0.0',
    endpoints: {
      auth:    ['POST /auth/register', 'POST /auth/login'],
      predict: ['POST /predict', 'GET /predict/history', 'GET /predict/:id'],
    },
  });
});

// ─── 404 Handler ──────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} tidak ditemukan` });
});

// ─── Global Error Handler ─────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

module.exports = app;