import mongoose from 'mongoose';

const artisanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', index: true },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    phone: { type: String, trim: true, maxlength: 30, default: '' },
    location: { type: String, trim: true, maxlength: 120, default: '' },
    
    craftType: { type: String, trim: true, default: '' },
    experienceYears: { type: Number, default: 0 },
    story: { type: String, default: '', maxlength: 2000 },
    
    shopName: { type: String, trim: true, default: '' },
    shopDescription: { type: String, default: '', maxlength: 2000 },
    productCategories: { type: [String], default: [] },
    monthlyProduction: { type: String, default: '' },

    artisanPhoto: { type: String, default: '' },
    workshopPhoto: { type: String, default: '' },
    sampleProducts: [
      {
        imageUrl: { type: String, default: '' },
        caption: { type: String, default: '' }
      }
    ],

    paymentDetails: {
      upiId: { type: String, default: '' },
      accountNumber: { type: String, default: '' },
      ifscCode: { type: String, default: '' }
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

artisanSchema.index({ email: 1 }, { unique: true });

export const Artisan = mongoose.model('Artisan', artisanSchema);
