const router  = require('express').Router();
const ctrl    = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../validators/authValidator');
const { protect } = require('../middlewares/authMiddleware');

// POST /auth/register
router.post('/register', validateRegister, ctrl.register);

// POST /auth/login
router.post('/login', validateLogin, ctrl.login);

// GET /auth/profile  (butuh token)
router.get('/profile', protect, ctrl.getProfile);

// PUT /auth/profile  (ubah password, butuh token)
router.put('/profile', protect, ctrl.updateProfile);

// POST /auth/reset-password  (reset password lupa)
router.post('/reset-password', ctrl.resetPassword);

module.exports = router;