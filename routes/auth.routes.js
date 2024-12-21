const express = require('express');
const { signup, login, getProfile } = require('../controllers/auth.controllers');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', authMiddleware ,getProfile);

module.exports = router;


