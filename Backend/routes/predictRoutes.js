const router  = require('express').Router();
const ctrl    = require('../controllers/predictController');
const { protect }        = require('../middlewares/authMiddleware');
const { validatePredict } = require('../validators/predictValidator');

// Semua route predict butuh login
router.use(protect);

// POST /predict        — kirim data & dapatkan skor kredit
router.post('/',          validatePredict, ctrl.predict);

// GET  /predict/history — riwayat semua prediksi user
router.get('/history',    ctrl.history);

// GET  /predict/:id    — detail satu prediksi
router.get('/:id',        ctrl.detail);

module.exports = router;