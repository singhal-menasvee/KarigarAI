import mongoose from 'mongoose';
import { z } from 'zod';
import { Artisan } from '../models/Artisan.js';
import { Product } from '../models/Product.js';

const objectIdSchema = z.string().refine((v) => mongoose.Types.ObjectId.isValid(v), {
  message: 'Invalid id',
});

export const createArtisanBodySchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().email().trim().toLowerCase().max(254),
    location: z.string().trim().max(120).optional().default(''),
    craftTypes: z.array(z.string().trim().min(1).max(50)).optional().default([]),
    profileImage: z.string().url().optional().default(''),
    bio: z.string().trim().max(2000).optional().default(''),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});

export async function createArtisan(req, res, next) {
  try {
    const created = await Artisan.create(req.validated.body);
    res.status(201).json(created);
  } catch (err) {
    // handle duplicate email nicely
    if (err?.code === 11000) {
      err.statusCode = 409;
      err.message = 'Artisan with this email already exists';
    }
    next(err);
  }
}

export const artisanIdParamsSchema = z.object({
  params: z.object({ id: objectIdSchema }),
  body: z.any().optional(),
  query: z.any().optional(),
});

export async function getArtisanById(req, res, next) {
  try {
    const { id } = req.validated.params;
    const artisan = await Artisan.findById(id).lean();
    if (!artisan) return res.status(404).json({ error: { message: 'Artisan not found' } });
    res.json(artisan);
  } catch (err) {
    next(err);
  }
}

export async function getProductsByArtisan(req, res, next) {
  try {
    const { id } = req.validated.params;
    const products = await Product.find({ artisanId: id })
      .sort({ createdAt: -1 })
      .lean();
    res.json(products);
  } catch (err) {
    next(err);
  }
}

