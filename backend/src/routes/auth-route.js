import express from 'express';
import { login, register } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.js';
import { loginValidate, registerValidate } from '../validators/authValidation.js';
const router = express.Router();

router.post('/register', validate(registerValidate), register);
router.post('/login', validate(loginValidate), login)

export default router;