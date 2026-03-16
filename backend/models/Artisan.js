import mongoose from 'mongoose';

const artisanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    location: { type: String, trim: true, maxlength: 120, default: '' },
    craftTypes: { type: [String], default: [], index: true },
    profileImage: { type: String, default: '' },
    bio: { type: String, default: '', maxlength: 2000 },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

artisanSchema.index({ email: 1 }, { unique: true });
artisanSchema.index({ createdAt: -1 });

export const Artisan = mongoose.model('Artisan', artisanSchema);

