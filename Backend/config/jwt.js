require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || 'microcred_secret_key',
  expiresIn: '7d',
};