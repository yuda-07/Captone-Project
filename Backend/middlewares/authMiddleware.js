const { verifyToken } = require('../utils/generateToken');
const { error }       = require('../utils/response');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer '))
    return error(res, 'Unauthorized: Token tidak ditemukan', 401);

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // { id, email }
    next();
  } catch {
    return error(res, 'Unauthorized: Token tidak valid atau sudah expired', 401);
  }
};

module.exports = { protect };