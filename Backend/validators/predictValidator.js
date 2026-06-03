const validatePredict = (req, res, next) => {
  const {
    nama_usaha,
    usia_pemilik,
    lama_usaha,
    pendapatan_bulanan,
    pengeluaran_bulanan,
    jumlah_pinjaman,
  } = req.body;

  const errs = [];

  if (!nama_usaha || nama_usaha.trim() === '')
    errs.push('Nama usaha wajib diisi');
  if (!usia_pemilik || isNaN(usia_pemilik) || usia_pemilik < 17 || usia_pemilik > 99)
    errs.push('Usia pemilik tidak valid (17-99 tahun)');
  if (!lama_usaha || isNaN(lama_usaha) || lama_usaha < 0)
    errs.push('Lama usaha tidak valid');
  if (!pendapatan_bulanan || isNaN(pendapatan_bulanan) || pendapatan_bulanan <= 0)
    errs.push('Pendapatan bulanan wajib diisi dan harus lebih dari 0');
  if (!pengeluaran_bulanan || isNaN(pengeluaran_bulanan) || pengeluaran_bulanan < 0)
    errs.push('Pengeluaran bulanan tidak valid');
  if (!jumlah_pinjaman || isNaN(jumlah_pinjaman) || jumlah_pinjaman <= 0)
    errs.push('Jumlah pinjaman wajib diisi dan harus lebih dari 0');

  if (errs.length > 0)
    return res.status(400).json({ success: false, message: 'Validasi gagal', errors: errs });

  next();
};

module.exports = { validatePredict };