import express from 'express';
import User from '../models/user.js';
import { validateUserRegistration, validateUserLogin } from '../middleware/validation.js';

const router = express.Router();

// POST /auth/register
router.post('/register', validateUserRegistration, User.register);

// POST /auth/login
router.post('/login', validateUserLogin, User.login);

export default router;
