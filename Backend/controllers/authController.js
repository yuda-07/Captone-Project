const authService    = require('../services/authService');
const userRepo       = require('../repositories/userRepository');
const { success, error } = require('../utils/response');

const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    return success(res, user, 'Registrasi berhasil', 201);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return success(res, result, 'Login berhasil');
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await userRepo.findById(req.user.id);
    if (!user) return error(res, 'User tidak ditemukan', 404);
    return success(res, user, 'Profil berhasil diambil');
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const result = await authService.resetPassword(req.body);
    return success(res, result, 'Password berhasil direset');
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const result = await authService.updateProfile(req.user.id, req.body);
    return success(res, result, 'Password berhasil diperbarui');
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getProfile, resetPassword, updateProfile };