import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { connectDb } from './config/db.js';
import { initCloudinary } from './config/cloudinary.js';
import productsRouter from './routes/products.js';
import artisansRouter from './routes/artisans.js';
import artisanRouter from './routes/artisan.js';
import profileRouter from './routes/profile.js';
import chatbotRouter from './routes/chatbot.js'; // 👈 ADDED HERE
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

const PORT = process.env.PORT || 5001;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

app.use(helmet());
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// NOTE: JSON routes + multipart routes
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'karigarai-backend' });
});

app.use('/api/products', productsRouter);
app.use('/api/artisans', artisansRouter);
app.use('/api/artisan', artisanRouter);
app.use('/api/profile', profileRouter);
app.use('/api/chatbot', chatbotRouter); // 👈 ADDED HERE

app.use(notFound);
app.use(errorHandler);

async function start() {
  await connectDb();
  const cloudinaryReady = initCloudinary();
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log(`[cloudinary] ${cloudinaryReady ? 'ready' : 'not configured'}`);
  }

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[server] listening on :${PORT}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});