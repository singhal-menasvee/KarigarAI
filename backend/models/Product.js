import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    description: { type: String, default: '', trim: true, maxlength: 4000 },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, default: '', trim: true, index: true },

    artisanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artisan',
      required: true,
      index: true,
    },
    artisanName: { type: String, default: '', trim: true, index: true },
    location: { type: String, default: '', trim: true, index: true },

    images: { type: [String], default: [] },

    stock: { type: Number, default: 0, min: 0 },
    views: { type: Number, default: 0, min: 0, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

// Marketplace query optimization
productSchema.index({ category: 1, createdAt: -1 });
productSchema.index({ artisanId: 1, createdAt: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({
  title: 'text',
  description: 'text',
  artisanName: 'text',
  location: 'text',
});

export const Product = mongoose.model('Product', productSchema);

