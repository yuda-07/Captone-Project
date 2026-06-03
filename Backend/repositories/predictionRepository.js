const pool = require('../config/database');

const save = async ({
  user_id, nama_usaha, usia_pemilik, lama_usaha,
  pendapatan_bulanan, pengeluaran_bulanan, jumlah_pinjaman,
  riwayat_telat_bayar = 0, jumlah_tanggungan = 0,
  score, status,
}) => {
  const res = await pool.query(
    `INSERT INTO predictions
       (user_id, nama_usaha, usia_pemilik, lama_usaha, pendapatan_bulanan,
        pengeluaran_bulanan, jumlah_pinjaman, riwayat_telat_bayar,
        jumlah_tanggungan, score, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING *`,
    [
      user_id, nama_usaha, usia_pemilik, lama_usaha,
      pendapatan_bulanan, pengeluaran_bulanan, jumlah_pinjaman,
      riwayat_telat_bayar, jumlah_tanggungan, score, status,
    ]
  );
  return res.rows[0];
};

const findByUserId = async (user_id) => {
  const res = await pool.query(
    `SELECT * FROM predictions
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [user_id]
  );
  return res.rows;
};

const findById = async (id) => {
  const res = await pool.query(
    `SELECT * FROM predictions WHERE id = $1 LIMIT 1`, [id]
  );
  return res.rows[0] || null;
};

module.exports = { save, findByUserId, findById };