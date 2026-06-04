const validatePredict = (req, res, next) => {
  const {
    nama_usaha,
    person_age,
    person_income,
    person_emp_length,
    loan_amnt,
    loan_percent_income,
  } = req.body;

  const errs = [];

  if (!nama_usaha || nama_usaha.trim() === '')
    errs.push('Nama usaha wajib diisi');
  if (!person_age || isNaN(person_age) || person_age < 17 || person_age > 99)
    errs.push('Usia tidak valid (17-99 tahun)');
  if (person_emp_length === undefined || person_emp_length === '' || isNaN(person_emp_length) || person_emp_length < 0)
    errs.push('Lama bekerja tidak valid');
  if (!person_income || isNaN(person_income) || person_income <= 0)
    errs.push('Pendapatan wajib diisi dan harus lebih dari 0');
  if (!loan_amnt || isNaN(loan_amnt) || loan_amnt <= 0)
    errs.push('Jumlah pinjaman wajib diisi dan harus lebih dari 0');
  if (loan_percent_income === undefined || loan_percent_income === '' || isNaN(loan_percent_income) || loan_percent_income < 0)
    errs.push('Rasio pinjaman tidak valid');

  if (errs.length > 0)
    return res.status(400).json({ success: false, message: 'Validasi gagal', errors: errs });

  next();
};

module.exports = { validatePredict };