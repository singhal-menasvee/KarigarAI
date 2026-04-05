import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    phone: { type: String, default: '', trim: true, maxlength: 30 },
    address: { type: String, default: '', trim: true, maxlength: 400 },
    bio: { type: String, default: '', trim: true, maxlength: 2000 },
    profileImage: { type: String, default: '' },
    role: {
      type: String,
      enum: ['user', 'artisan'],
      default: 'user',
      index: true,
    },
    artisanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artisan',
      default: null,
      index: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

profileSchema.index({ email: 1 }, { unique: true });

export const Profile = mongoose.model('Profile', profileSchema);

