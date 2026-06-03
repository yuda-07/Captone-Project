const axios          = require('axios');
const predictionRepo = require('../repositories/predictionRepository');
const auditRepo      = require('../repositories/auditRepository');
require('dotenv').config();

const AI_URL = process.env.AI_INFERENCE_URL || 'http://localhost:5000/predict';

const predict = async (userId, body) => {
  const {
    nama_usaha,
    usia_pemilik,
    lama_usaha,
    pendapatan_bulanan,
    pengeluaran_bulanan,
    jumlah_pinjaman,
    riwayat_telat_bayar = 0,
    jumlah_tanggungan   = 0,
  } = body;

  // Payload yang dikirim ke AI Inference (sesuai kontrak API)
  const aiPayload = {
    usia_pemilik:        Number(usia_pemilik),
    lama_usaha:          Number(lama_usaha),
    pendapatan_bulanan:  Number(pendapatan_bulanan),
    pengeluaran_bulanan: Number(pengeluaran_bulanan),
    jumlah_pinjaman:     Number(jumlah_pinjaman),
    riwayat_telat_bayar: Number(riwayat_telat_bayar),
    jumlah_tanggungan:   Number(jumlah_tanggungan),
  };

  let score, status;

  try {
    // Kirim ke AI Inference API
    const aiRes = await axios.post(AI_URL, aiPayload, { timeout: 10000 });
    score  = aiRes.data.score;
    status = aiRes.data.status;
  } catch (err) {
    // Jika AI belum siap, pakai mock response sementara
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
      console.warn('⚠️  AI Inference belum siap, menggunakan mock response');
      score  = 700;
      status = 'Layak';
    } else {
      const e = new Error('Gagal menghubungi AI Inference API');
      e.statusCode = 502;
      throw e;
    }
  }

  // Simpan hasil ke database
  const prediction = await predictionRepo.save({
    user_id: userId,
    nama_usaha,
    usia_pemilik,
    lama_usaha,
    pendapatan_bulanan,
    pengeluaran_bulanan,
    jumlah_pinjaman,
    riwayat_telat_bayar,
    jumlah_tanggungan,
    score,
    status,
  });

  await auditRepo.log(
    userId, 'PREDICT',
    `Prediksi usaha "${nama_usaha}" — Score: ${score}, Status: ${status}`
  );

  return prediction;
};

const getHistory = async (userId) => {
  return predictionRepo.findByUserId(userId);
};

const getDetail = async (userId, predictionId) => {
  const data = await predictionRepo.findById(predictionId);
  if (!data) {
    const err = new Error('Data prediksi tidak ditemukan');
    err.statusCode = 404;
    throw err;
  }
  if (data.user_id !== userId) {
    const err = new Error('Akses ditolak');
    err.statusCode = 403;
    throw err;
  }
  return data;
};

module.exports = { predict, getHistory, getDetail };