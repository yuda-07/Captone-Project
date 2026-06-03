const pool = require('../config/database');

const log = async (user_id, action, details) => {
  await pool.query(
    `INSERT INTO audit_log (user_id, action, details)
     VALUES ($1, $2, $3)`,
    [user_id, action, details]
  );
};

module.exports = { log };