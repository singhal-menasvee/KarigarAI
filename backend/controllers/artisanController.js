import mongoose from 'mongoose';
import { z } from 'zod';
import { Artisan } from '../models/Artisan.js';
import { Product } from '../models/Product.js';
import { Profile } from '../models/Profile.js';
import { uploadBufferToCloudinary } from '../middleware/upload.js';

const objectIdSchema = z.string().refine((v) => mongoose.Types.ObjectId.isValid(v), {
  message: 'Invalid id',
});

// We only validate the string payload (FormData fields)
export const registerArtisanBodySchema = z.object({
  body: z.object({
    email: z.string().email().trim().toLowerCase().max(254),
    name: z.string().trim().min(2).max(120),
    phone: z.string().trim().max(30).optional().default(''),
    location: z.string().trim().max(120).optional().default(''),
    craftType: z.string().trim().optional().default(''),
    experienceYears: z.coerce.number().optional().default(0),
    story: z.string().trim().max(2000).optional().default(''),
    shopName: z.string().trim().optional().default(''),
    shopDescription: z.string().trim().max(2000).optional().default(''),
    productCategories: z.string().optional().default(''), // comma separated
    monthlyProduction: z.string().trim().optional().default(''),
    upiId: z.string().trim().optional().default(''),
    accountNumber: z.string().trim().optional().default(''),
    ifscCode: z.string().trim().optional().default(''),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});

export async function registerArtisan(req, res, next) {
  try {
    const data = req.validated.body;
    let artisanPhotoUrl = '';
    let workshopPhotoUrl = '';
    const sampleProductsData = [];

    // Process file uploads
    if (req.files) {
      if (!process.env.CLOUDINARY_CLOUD_NAME) {
        return res.status(500).json({ error: { message: 'Cloudinary not configured on server' } });
      }

      if (req.files.artisanPhoto && req.files.artisanPhoto[0]) {
        const result = await uploadBufferToCloudinary({ buffer: req.files.artisanPhoto[0].buffer, folder: 'karigarai/artisans' });
        artisanPhotoUrl = result.secure_url;
      }
      if (req.files.workshopPhoto && req.files.workshopPhoto[0]) {
        const result = await uploadBufferToCloudinary({ buffer: req.files.workshopPhoto[0].buffer, folder: 'karigarai/artisans' });
        workshopPhotoUrl = result.secure_url;
      }
      if (req.files.sampleProducts) {
        for (const file of req.files.sampleProducts) {
          const result = await uploadBufferToCloudinary({ buffer: file.buffer, folder: 'karigarai/artisans/samples' });
          sampleProductsData.push({ imageUrl: result.secure_url, caption: '' });
        }
      }
    }

    // Get the user Profile to link
    const profile = await Profile.findOne({ email: data.email });
    let userId = null;
    if (profile) userId = profile._id;

    // Parse productCategories from comma separated string
    const categoryArray = data.productCategories ? data.productCategories.split(',').map(s => s.trim()).filter(Boolean) : [];

    // Create or update artisan doc (idempotent if retrying)
    const artisan = await Artisan.findOneAndUpdate(
      { email: data.email },
      {
        $setOnInsert: {
          email: data.email,
        },
        $set: {
          userId,
          name: data.name,
          phone: data.phone,
          location: data.location,
          craftType: data.craftType,
          experienceYears: data.experienceYears,
          story: data.story,
          shopName: data.shopName,
          shopDescription: data.shopDescription,
          productCategories: categoryArray,
          monthlyProduction: data.monthlyProduction,
          paymentDetails: {
            upiId: data.upiId,
            accountNumber: data.accountNumber,
            ifscCode: data.ifscCode
          },
          status: 'pending',
          ...(artisanPhotoUrl && { artisanPhoto: artisanPhotoUrl }),
          ...(workshopPhotoUrl && { workshopPhoto: workshopPhotoUrl }),
        },
        $push: sampleProductsData.length > 0 ? { sampleProducts: { $each: sampleProductsData } } : {}
      },
      { new: true, upsert: true }
    ).lean();

    // Update Profile role to artisan
    if (profile) {
      await Profile.findByIdAndUpdate(profile._id, {
        $set: { role: 'artisan', artisanId: artisan._id }
      });
    }

    res.status(200).json(artisan);
  } catch (err) {
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
