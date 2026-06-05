const bcrypt          = require('bcrypt');
const userRepo        = require('../repositories/userRepository');
const auditRepo       = require('../repositories/auditRepository');
const { generateToken } = require('../utils/generateToken');

const register = async ({ name, email, password }) => {
  // Cek email sudah terdaftar
  const existing = await userRepo.findByEmail(email);
  if (existing) {
    const err = new Error('Email sudah terdaftar');
    err.statusCode = 409;
    throw err;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user   = await userRepo.create({ name, email, password: hashed });

  await auditRepo.log(user.id, 'REGISTER', `User ${email} berhasil registrasi`);

  return user;
};

const login = async ({ email, password }) => {
  const user = await userRepo.findByEmail(email);
  if (!user) {
    const err = new Error('Email tidak ditemukan');
    err.statusCode = 404;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    const err = new Error('Password salah');
    err.statusCode = 401;
    throw err;
  }

  const token = generateToken({ id: user.id, email: user.email });

  await auditRepo.log(user.id, 'LOGIN', `User ${email} berhasil login`);

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email },
  };
};

const resetPassword = async ({ name, email, newPassword }) => {
  const user = await userRepo.findByEmail(email);
  if (!user) {
    const err = new Error('Email tidak ditemukan');
    err.statusCode = 404;
    throw err;
  }

  // Verifikasi nama (case-insensitive & trim)
  if (user.name.trim().toLowerCase() !== name.trim().toLowerCase()) {
    const err = new Error('Nama lengkap tidak sesuai');
    err.statusCode = 400;
    throw err;
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await userRepo.updatePassword(user.id, hashed);

  await auditRepo.log(user.id, 'RESET_PASSWORD', `User ${email} mereset password`);
  return { success: true };
};

const updateProfile = async (userId, { currentPassword, newPassword }) => {
  const user = await userRepo.findByIdWithPassword(userId);
  if (!user) {
    const err = new Error('User tidak ditemukan');
    err.statusCode = 404;
    throw err;
  }

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) {
    const err = new Error('Password lama salah');
    err.statusCode = 400;
    throw err;
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await userRepo.updatePassword(userId, hashed);

  await auditRepo.log(userId, 'UPDATE_PASSWORD', `User ${user.email} mengubah password`);
  return { success: true };
};

module.exports = { register, login, resetPassword, updateProfile };