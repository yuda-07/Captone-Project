const router  = require('express').Router();
const ctrl    = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../validators/authValidator');

// POST /auth/register
router.post('/register', validateRegister, ctrl.register);

// POST /auth/login
router.post('/login', validateLogin, ctrl.login);

module.exports = router;