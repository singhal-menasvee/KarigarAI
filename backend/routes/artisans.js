import express from 'express';
import { validate } from '../middleware/validate.js';
import {
  artisanIdParamsSchema,
  getArtisanById,
  getProductsByArtisan,
} from '../controllers/artisanController.js';

const router = express.Router();

// GET /api/artisans/:id
router.get('/:id', validate(artisanIdParamsSchema), getArtisanById);

// GET /api/artisans/:id/products
router.get('/:id/products', validate(artisanIdParamsSchema), getProductsByArtisan);

export default router;

