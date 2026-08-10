import express from 'express';
import rateLimit from 'express-rate-limit';
import { handleChat, handleGenerateStory } from '../controllers/chatbotController.js';

const router = express.Router();

// Rate Limiter: Max 10 messages per minute per IP
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { error: 'Too many messages sent. Please wait 60 seconds.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/chat', chatLimiter, handleChat);
router.post('/story', chatLimiter, handleGenerateStory);

export default router;