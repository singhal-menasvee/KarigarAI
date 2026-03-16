import express from 'express';
import { requireClerkAuth } from '../middleware/clerkAuth.js';
import { upload } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';
import {
  createProduct,
  createProductBodySchema,
  getAllProducts,
  getProductsQuerySchema,
  getProductById,
  productIdParamsSchema,
} from '../controllers/productController.js';

const router = express.Router();

// GET /api/products
router.get('/', validate(getProductsQuerySchema), getAllProducts);

// GET /api/products/:id
router.get('/:id', validate(productIdParamsSchema), getProductById);

// POST /api/products (artisan upload) - requires Clerk session token
router.post(
  '/',
  requireClerkAuth,
  upload.array('images', 6),
  validate(createProductBodySchema),
  createProduct
);

// TEST ENDPOINT: POST /api/products/test (no auth required - for testing only)
// Remove this in production!
router.post(
  '/test',
  upload.array('images', 6),
  validate(createProductBodySchema),
  createProduct
);

export default router;

