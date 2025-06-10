import express from 'express';
import { register } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.js';
import { registerValidate } from '../validators/authValidation.js';
const router = express.Router();

router.post('/register', validate(registerValidate), register);

export default router;