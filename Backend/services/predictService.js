const axios          = require('axios');
const predictionRepo = require('../repositories/predictionRepository');
const auditRepo      = require('../repositories/auditRepository');
require('dotenv').config();

const AI_URL = process.env.AI_INFERENCE_URL || 'http://localhost:5000/predict';

const predict = async (userId, body) => {
  const {
    nama_usaha,
    person_age,
    person_income,
    person_emp_length,
    loan_amnt,
    loan_percent_income,
    person_home_ownership     = 'RENT',
    loan_intent               = 'PERSONAL',
    cb_person_default_on_file = 'N',
  } = body;

  // Payload yang dikirim ke AI Inference (sesuai kontrak API ai-service/main.py)
  const aiPayload = {
    person_age:               Number(person_age),
    person_income:            Number(person_income),
    person_emp_length:        Number(person_emp_length),
    loan_amnt:                Number(loan_amnt),
    loan_percent_income:      Number(loan_percent_income),
    person_home_ownership,
    loan_intent,
    cb_person_default_on_file,
  };

  let score, status;
  let analysis, recommendations, growth_index, risk_level;

  try {
    // Kirim ke AI Inference API (FastAPI di port 5000)
    const aiRes = await axios.post(AI_URL, aiPayload, { timeout: 10000 });
    score           = aiRes.data.score;
    status          = aiRes.data.status;
    analysis        = aiRes.data.analysis;
    recommendations = aiRes.data.recommendations;
    growth_index    = aiRes.data.growth_index;
    risk_level      = aiRes.data.risk_level;
  } catch (err) {
    // Jika AI belum siap, pakai rule-based fallback sementara
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND' || err.code === 'ETIMEDOUT') {
      console.warn('⚠️  AI Inference belum siap, menggunakan rule-based fallback');
      const ratio     = Number(loan_percent_income);
      const defaulted = cb_person_default_on_file === 'Y';
      score = 600;
      if (ratio <= 0.3)  score += 100;
      else if (ratio >= 0.6) score -= 100;
      if (defaulted) score -= 150;
      score  = Math.max(300, Math.min(900, score));
      status = score >= 600 ? 'Layak' : 'Berisiko';

      risk_level = score >= 700 ? 'Rendah' : score >= 600 ? 'Sedang' : 'Tinggi';
      const dti = ratio * 100;
      analysis = `Berdasarkan analisis data finansial usaha ${loan_intent.toLowerCase()}, profil risiko tergolong ${risk_level.toLowerCase()} dengan skor ${score}/1000. ` +
        (defaulted ? "Terdapat riwayat gagal bayar sebelumnya yang menaikkan tingkat risiko." : "Catatan pembayaran bersih tanpa riwayat gagal bayar.") +
        ` Rasio DTI Anda adalah ${dti.toFixed(1)}%.`;
      
      recommendations = [];
      if (ratio > 0.3) {
        recommendations.push("Tingkatkan pendapatan bulanan atau kurangi pengeluaran untuk menekan rasio DTI di bawah 30%.");
      } else {
        recommendations.push("Pertahankan rasio pengeluaran dan rasio utang saat ini tetap di bawah 30% untuk menjaga reputasi keuangan.");
      }
      recommendations.push(defaulted ? "Selesaikan seluruh kewajiban tertunggak dan lampirkan bukti pelunasan saat pengajuan." : "Pertahankan pencatatan transaksi keuangan digital Anda.");
      growth_index = score >= 600 ? "+10%" : "-5%";
    } else {
      const e = new Error('Gagal menghubungi AI Inference API');
      e.statusCode = 502;
      throw e;
    }
  }

  // Petakan field baru ke kolom database lama (tanpa mengubah skema DB)
  const prediction = await predictionRepo.save({
    user_id:             userId,
    nama_usaha,
    usia_pemilik:        Number(person_age),
    lama_usaha:          Number(person_emp_length),
    pendapatan_bulanan:  Number(person_income),
    pengeluaran_bulanan: Math.round(Number(person_income) * Number(loan_percent_income)),
    jumlah_pinjaman:     Number(loan_amnt),
    riwayat_telat_bayar: cb_person_default_on_file === 'Y' ? 1 : 0,
    jumlah_tanggungan:   0,
    score,
    status,
  });

  await auditRepo.log(
    userId, 'PREDICT',
    `Prediksi usaha "${nama_usaha}" — Score: ${score}, Status: ${status}`
  );

  return {
    ...prediction,
    analysis,
    recommendations,
    growth_index,
    risk_level,
  };
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

  // Generate dynamic analysis and recommendations on the fly for history details
  const ratio = data.pendapatan_bulanan > 0 ? (data.jumlah_pinjaman / data.pendapatan_bulanan) : 0;
  const defaulted = data.riwayat_telat_bayar === 1;
  const score = data.score;
  
  const risk_level = score >= 700 ? 'Rendah' : score >= 600 ? 'Sedang' : 'Tinggi';
  const dti = ratio * 100;
  
  const analysis = `Berdasarkan analisis data finansial usaha ${data.nama_usaha}, profil risiko tergolong ${risk_level.toLowerCase()} dengan skor ${score}/1000. ` +
    (defaulted ? "Terdapat riwayat gagal bayar sebelumnya yang menaikkan tingkat risiko." : "Catatan pembayaran bersih tanpa riwayat gagal bayar.") +
    ` Rasio DTI Anda adalah ${dti.toFixed(1)}%.`;
    
  const recommendations = [];
  if (ratio > 0.3) {
    const targetIncome = data.jumlah_pinjaman / 0.3;
    const diff = targetIncome - data.pendapatan_bulanan;
    recommendations.push(`Tingkatkan pendapatan tahunan sebesar minimal Rp ${Math.round(diff).toLocaleString('id-ID')} untuk menekan rasio DTI di bawah 30%.`);
  } else {
    recommendations.push("Pertahankan rasio pengeluaran dan rasio utang saat ini tetap di bawah 30% untuk menjaga reputasi keuangan.");
  }
  recommendations.push(defaulted ? "Selesaikan seluruh kewajiban tertunggak dan lampirkan bukti pelunasan saat pengajuan." : "Pertahankan pencatatan transaksi keuangan digital Anda.");
  
  const growth_index = score >= 600 ? "+10%" : "-5%";

  return {
    ...data,
    analysis,
    recommendations,
    growth_index,
    risk_level,
    loan_percent_income: ratio
  };
};

module.exports = { predict, getHistory, getDetail };