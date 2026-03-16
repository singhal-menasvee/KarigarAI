import express from 'express';
import { requireClerkAuth } from '../middleware/clerkAuth.js';
import { validate } from '../middleware/validate.js';
import {
  artisanIdParamsSchema,
  createArtisan,
  createArtisanBodySchema,
  getArtisanById,
  getProductsByArtisan,
} from '../controllers/artisanController.js';

const router = express.Router();

// POST /api/artisans - requires Clerk session token
router.post('/', requireClerkAuth, validate(createArtisanBodySchema), createArtisan);

// TEST ENDPOINT: POST /api/artisans/test (no auth required - for testing only)
// Remove this in production!
router.post('/test', validate(createArtisanBodySchema), createArtisan);

// GET /api/artisans/:id
router.get('/:id', validate(artisanIdParamsSchema), getArtisanById);

// GET /api/artisans/:id/products
router.get('/:id/products', validate(artisanIdParamsSchema), getProductsByArtisan);

export default router;

