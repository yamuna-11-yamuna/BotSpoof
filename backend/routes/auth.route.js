import express from 'express';
import { signup, signin } from '../controllers/auth.controller.js';

const router = express.Router();

// Sign Up Route
router.post('/signup', signup);

// Sign In Route
router.post('/signin', signin);

export default router;