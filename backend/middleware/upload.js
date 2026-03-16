import multer from 'multer';
import { cloudinary } from '../config/cloudinary.js';

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024, // 8MB per file
    files: 6,
  },
});

export async function uploadBufferToCloudinary({
  buffer,
  folder = 'karigarai/products',
  resourceType = 'image',
}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      }
    );
    stream.end(buffer);
  });
}

