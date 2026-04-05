import express from 'express';
import { validate } from '../middleware/validate.js';
import {
  bootstrapProfile,
  bootstrapProfileBodySchema,
  getProfileByEmail,
  getProfileQuerySchema,
  updateProfileByEmail,
  updateProfileBodySchema,
  registerAsArtisan,
  registerArtisanBodySchema,
} from '../controllers/profileController.js';

const router = express.Router();

// POST /api/profile/bootstrap - automatic profile creation on signup (idempotent)
router.post('/bootstrap', validate(bootstrapProfileBodySchema), bootstrapProfile);

// GET /api/profile?email=...
router.get('/', validate(getProfileQuerySchema), getProfileByEmail);

// PUT /api/profile?email=...
router.put('/', validate(updateProfileBodySchema), updateProfileByEmail);

// POST /api/profile/register-artisan
router.post('/register-artisan', validate(registerArtisanBodySchema), registerAsArtisan);

export default router;

