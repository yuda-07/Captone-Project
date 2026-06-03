const predictService     = require('../services/predictService');
const { success, error } = require('../utils/response');

const predict = async (req, res, next) => {
  try {
    const result = await predictService.predict(req.user.id, req.body);
    return success(res, result, 'Prediksi berhasil', 201);
  } catch (err) {
    next(err);
  }
};

const history = async (req, res, next) => {
  try {
    const data = await predictService.getHistory(req.user.id);
    return success(res, data, 'Riwayat prediksi berhasil diambil');
  } catch (err) {
    next(err);
  }
};

const detail = async (req, res, next) => {
  try {
    const data = await predictService.getDetail(req.user.id, req.params.id);
    return success(res, data, 'Detail prediksi berhasil diambil');
  } catch (err) {
    next(err);
  }
};

module.exports = { predict, history, detail };