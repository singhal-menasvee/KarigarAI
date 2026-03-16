import mongoose from 'mongoose';
import { z } from 'zod';
import { Product } from '../models/Product.js';
import { uploadBufferToCloudinary } from '../middleware/upload.js';

const objectIdSchema = z.string().refine((v) => mongoose.Types.ObjectId.isValid(v), {
  message: 'Invalid id',
});

export const getProductsQuerySchema = z.object({
  query: z.object({
    search: z.string().trim().min(1).max(200).optional(),
    category: z.string().trim().min(1).max(100).optional(),
    artisanId: z.string().trim().optional(),
    page: z.coerce.number().int().min(1).max(1000).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
  }),
  body: z.any().optional(),
  params: z.any().optional(),
});

export async function getAllProducts(req, res, next) {
  try {
    const { search, category, artisanId } = req.validated?.query ?? req.query;
    const page = Number(req.validated?.query?.page ?? req.query.page ?? 1);
    const limit = Number(req.validated?.query?.limit ?? req.query.limit ?? 24);
    const skip = (page - 1) * limit;

    const filter = {};

    if (category) filter.category = category;
    if (artisanId && mongoose.Types.ObjectId.isValid(artisanId)) {
      filter.artisanId = artisanId;
    }
    if (search) {
      filter.$text = { $search: search };
    }

    const products = await Product.find(filter)
      .sort(search ? { score: { $meta: 'textScore' }, createdAt: -1 } : { createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json(products);
  } catch (err) {
    next(err);
  }
}

export const productIdParamsSchema = z.object({
  params: z.object({ id: objectIdSchema }),
  query: z.any().optional(),
  body: z.any().optional(),
});

export async function getProductById(req, res, next) {
  try {
    const { id } = req.validated.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).lean();

    if (!product) return res.status(404).json({ error: { message: 'Product not found' } });

    res.json(product);
  } catch (err) {
    next(err);
  }
}

export const createProductBodySchema = z.object({
  body: z.object({
    title: z.string().trim().min(2).max(140),
    description: z.string().trim().max(4000).optional().default(''),
    price: z.coerce.number().min(0),
    category: z.string().trim().min(1).max(100),
    artisanId: objectIdSchema,
    artisanName: z.string().trim().min(1).max(120),
    location: z.string().trim().max(120).optional().default(''),
    stock: z.coerce.number().int().min(0).optional().default(0),
    images: z.array(z.string().url()).optional(),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});

export async function createProduct(req, res, next) {
  try {
    const body = req.validated.body;

    let imageUrls = Array.isArray(body.images) ? body.images : [];

    // If files were uploaded, push Cloudinary URLs
    if (Array.isArray(req.files) && req.files.length > 0) {
      if (!process.env.CLOUDINARY_CLOUD_NAME) {
        return res.status(500).json({
          error: { message: 'Cloudinary not configured on server' },
        });
      }

      const uploads = await Promise.all(
        req.files.map((f) =>
          uploadBufferToCloudinary({ buffer: f.buffer }).then((r) => r.secure_url)
        )
      );
      imageUrls = [...imageUrls, ...uploads];
    }

    const created = await Product.create({
      ...body,
      images: imageUrls,
    });

    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

