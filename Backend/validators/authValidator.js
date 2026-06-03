const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errs = [];

  if (!name || name.trim() === '')         errs.push('Name wajib diisi');
  if (!email || !/\S+@\S+\.\S+/.test(email)) errs.push('Email tidak valid');
  if (!password || password.length < 6)    errs.push('Password minimal 6 karakter');

  if (errs.length > 0)
    return res.status(400).json({ success: false, message: 'Validasi gagal', errors: errs });

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errs = [];

  if (!email || !/\S+@\S+\.\S+/.test(email)) errs.push('Email tidak valid');
  if (!password || password.trim() === '')    errs.push('Password wajib diisi');

  if (errs.length > 0)
    return res.status(400).json({ success: false, message: 'Validasi gagal', errors: errs });

  next();
};

module.exports = { validateRegister, validateLogin };