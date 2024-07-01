const express = require('express');
const { registerUser, loginUser, getUser } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const { check } = require('express-validator');

const router = express.Router();

router.post('/register', [
    check('username', 'Username must be at least 3 characters long').isLength({ min: 3 }),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 8 characters long').isLength({ min: 8 })
], registerUser);

router.post('/login', loginUser);
router.get('/user', verifyToken, getUser);

module.exports = router;
