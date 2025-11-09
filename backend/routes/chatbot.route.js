import express from 'express';
import { sendMessage, authenticateUser } from '../controllers/chatbot.message.js';

const router = express.Router();

router.post('/message', authenticateUser, sendMessage);

export default router;