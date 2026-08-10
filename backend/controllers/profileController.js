import { z } from 'zod';
import { Profile } from '../models/Profile.js';
import { uploadBufferToCloudinary } from '../middleware/upload.js';

const emailSchema = z.string().email().trim().toLowerCase().max(254);

export const bootstrapProfileBodySchema = z.object({
  body: z.object({
    username: z.string().trim().min(2).max(120),
    email: emailSchema,
    role: z.enum(['user', 'buyer', 'artisan']).optional(),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});

export async function bootstrapProfile(req, res, next) {
  try {
    const { username, email, role } = req.validated.body;
    const initialRole = role === 'artisan' ? 'artisan' : 'buyer';
    // Idempotent + race-safe: multiple bootstrap calls can happen concurrently in the UI.
    // Use upsert to avoid duplicate key errors on the unique email index.
    const doc = await Profile.findOneAndUpdate(
      { email },
      {
        $setOnInsert: {
          username,
          email,
          phone: '',
          address: '',
          bio: '',
          profileImage: '',
          role: initialRole,
        },
      },
      { new: true, upsert: true }
    ).lean();

    return res.status(200).json(doc);
  } catch (err) {
    // In rare race conditions, Mongo can still throw duplicate key; recover gracefully.
    if (err?.code === 11000) {
      try {
        const { email } = req.validated.body;
        const existing = await Profile.findOne({ email }).lean();
        if (existing) return res.status(200).json(existing);
      } catch {
        // fallthrough
      }
    }
    next(err);
  }
}

export const getProfileQuerySchema = z.object({
  query: z.object({
    email: emailSchema,
  }),
  body: z.any().optional(),
  params: z.any().optional(),
});

export async function getProfileByEmail(req, res, next) {
  try {
    const { email } = req.validated.query;
    const profile = await Profile.findOne({ email }).lean();
    if (!profile) {
      return res.status(404).json({ error: { message: 'Profile not found' } });
    }
    return res.json(profile);
  } catch (err) {
    next(err);
  }
}

export const updateProfileBodySchema = z.object({
  query: z.object({
    email: emailSchema,
  }),
  body: z.object({
    username: z.string().regex(/^[a-zA-Z0-9 ]+$/, "Only letters, numbers, and spaces allowed").trim().min(3).max(120).optional(),
    phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits").optional(),
    address: z.string().trim().min(5).max(200).optional(),
    bio: z.string().trim().max(300).optional(),
    profileImage: z.string().url().optional(),
  }),
  params: z.any().optional(),
});

export async function updateProfileByEmail(req, res, next) {
  try {
    const { email } = req.validated.query;
    const updates = { ...req.validated.body };

    if (req.file) {
      if (!process.env.CLOUDINARY_CLOUD_NAME) {
        return res.status(500).json({ error: { message: 'Cloudinary not configured on server' } });
      }
      const uploadResult = await uploadBufferToCloudinary({ buffer: req.file.buffer, folder: 'karigarai/profiles' });
      updates.profileImage = uploadResult.secure_url;
    }

    const updated = await Profile.findOneAndUpdate(
      { email },
      { $set: updates },
      { new: true, upsert: false }
    ).lean();

    if (!updated) {
      return res.status(404).json({ error: { message: 'Profile not found' } });
    }

    return res.json(updated);
  } catch (err) {
    next(err);
  }
}

