const express = require('express');
const User = require('../models/user');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validation');

const router = express.Router();

// POST /auth/register
router.post('/register', validateUserRegistration, User.register);

// POST /auth/login
router.post('/login', validateUserLogin, User.login);

module.exports = router;
