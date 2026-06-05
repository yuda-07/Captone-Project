require('dotenv').config();

module.exports = {
  secret:          process.env.ACCESS_TOKEN_KEY  || 'microcred_access_token_secret_key_2026',
  accessTokenKey:  process.env.ACCESS_TOKEN_KEY  || 'microcred_access_token_secret_key_2026',
  refreshTokenKey: process.env.REFRESH_TOKEN_KEY || 'microcred_refresh_token_secret_key_2026',
  expiresIn: '7d',
};