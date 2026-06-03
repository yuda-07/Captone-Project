const authService    = require('../services/authService');
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

module.exports = { register, login };