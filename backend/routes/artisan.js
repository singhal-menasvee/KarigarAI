import express from 'express';
import { upload } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';
import { getArtisanById, getProductsByArtisan, registerArtisan, registerArtisanBodySchema, artisanIdParamsSchema } from '../controllers/artisanController.js';

const router = express.Router();

router.post(
  '/register',
  upload.fields([
    { name: 'artisanPhoto', maxCount: 1 },
    { name: 'workshopPhoto', maxCount: 1 },
    { name: 'sampleProducts', maxCount: 5 },
  ]),
  validate(registerArtisanBodySchema),
  registerArtisan
);

router.get('/:id', validate(artisanIdParamsSchema), getArtisanById);
router.get('/:id/products', validate(artisanIdParamsSchema), getProductsByArtisan);

export default router;
