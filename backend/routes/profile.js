import express from 'express';
import { validate } from '../middleware/validate.js';
import { upload } from '../middleware/upload.js';
import {
  bootstrapProfile,
  bootstrapProfileBodySchema,
  getProfileByEmail,
  getProfileQuerySchema,
  updateProfileByEmail,
  updateProfileBodySchema,
} from '../controllers/profileController.js';

const router = express.Router();

// POST /api/profile/bootstrap - automatic profile creation on signup (idempotent)
router.post('/bootstrap', validate(bootstrapProfileBodySchema), bootstrapProfile);

// GET /api/profile?email=...
router.get('/', validate(getProfileQuerySchema), getProfileByEmail);

// PUT /api/profile?email=...
router.put('/', upload.single('profileImage'), validate(updateProfileBodySchema), updateProfileByEmail);

export default router;
