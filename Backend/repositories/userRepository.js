const pool = require('../config/database');

const findByEmail = async (email) => {
  const res = await pool.query(
    `SELECT * FROM users WHERE email = $1 LIMIT 1`, [email]
  );
  return res.rows[0] || null;
};

const findById = async (id) => {
  const res = await pool.query(
    `SELECT id, name, email, created_at FROM users WHERE id = $1 LIMIT 1`, [id]
  );
  return res.rows[0] || null;
};

const findByIdWithPassword = async (id) => {
  const res = await pool.query(
    `SELECT * FROM users WHERE id = $1 LIMIT 1`, [id]
  );
  return res.rows[0] || null;
};

const create = async ({ name, email, password }) => {
  const res = await pool.query(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at`,
    [name, email, password]
  );
  return res.rows[0];
};

const updatePassword = async (id, hashedPassword) => {
  const res = await pool.query(
    `UPDATE users SET password = $1 WHERE id = $2 RETURNING id, name, email`,
    [hashedPassword, id]
  );
  return res.rows[0] || null;
};

module.exports = { findByEmail, findById, findByIdWithPassword, create, updatePassword };