import { z } from 'zod';
import { Profile } from '../models/Profile.js';
import { Artisan } from '../models/Artisan.js';

const emailSchema = z.string().email().trim().toLowerCase().max(254);

export const bootstrapProfileBodySchema = z.object({
  body: z.object({
    username: z.string().trim().min(2).max(120),
    email: emailSchema,
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});

export async function bootstrapProfile(req, res, next) {
  try {
    const { username, email } = req.validated.body;
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
          role: 'user',
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
    username: z.string().trim().min(2).max(120).optional(),
    phone: z.string().trim().max(30).optional(),
    address: z.string().trim().max(400).optional(),
    bio: z.string().trim().max(2000).optional(),
    profileImage: z.string().url().optional(),
  }),
  params: z.any().optional(),
});

export async function updateProfileByEmail(req, res, next) {
  try {
    const { email } = req.validated.query;
    const updates = req.validated.body;

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

export const registerArtisanBodySchema = z.object({
  body: z.object({
    email: emailSchema,
    name: z.string().trim().min(2).max(120),
    location: z.string().trim().max(120).optional().default(''),
    craftTypes: z.array(z.string().trim().min(1).max(50)).optional().default([]),
    profileImage: z.string().url().optional().default(''),
    bio: z.string().trim().max(2000).optional().default(''),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});

export async function registerAsArtisan(req, res, next) {
  try {
    const { email, name, location, craftTypes, profileImage, bio } = req.validated.body;

    // Ensure profile exists (idempotent)
    const profile = await Profile.findOneAndUpdate(
      { email },
      {
        $setOnInsert: {
          username: name,
          email,
          phone: '',
          address: '',
          bio: bio || '',
          profileImage: profileImage || '',
          role: 'user',
        },
        $set: {
          // Keep username in sync if they choose to register with updated name
          username: name,
        },
      },
      { new: true, upsert: true }
    );

    // Ensure artisan exists (idempotent)
    const artisan = await Artisan.findOneAndUpdate(
      { email },
      {
        $setOnInsert: {
          name,
          email,
          location: location || '',
          craftTypes: craftTypes || [],
          profileImage: profileImage || '',
          bio: bio || profile.bio || '',
        },
        $set: {
          name,
          location: location || '',
          craftTypes: craftTypes || [],
          ...(profileImage ? { profileImage } : {}),
          ...(bio ? { bio } : {}),
        },
      },
      { new: true, upsert: true }
    ).lean();

    const updated = await Profile.findOneAndUpdate(
      { email },
      { $set: { role: 'artisan', artisanId: artisan._id } },
      { new: true }
    ).lean();

    return res.status(200).json(updated);
  } catch (err) {
    if (err?.code === 11000) {
      err.statusCode = 409;
      err.message = 'Profile or artisan already exists';
    }
    next(err);
  }
}

