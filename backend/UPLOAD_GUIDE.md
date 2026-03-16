# Product Upload Guide - Using Postman/Thunder Client

## Quick Start: Test Endpoint (No Auth Required)

Use this endpoint for quick testing without Clerk authentication.

### Endpoint
```
POST http://localhost:5001/api/products/test
```

---

## Step-by-Step Instructions

### Option A: Using Postman

1. **Open Postman** and create a new request

2. **Set Method & URL:**
   - Method: `POST`
   - URL: `http://localhost:5001/api/products/test`

3. **Set Headers:**
   - Go to **Headers** tab
   - No special headers needed for the test endpoint

4. **Set Body:**
   - Go to **Body** tab
   - Select **form-data** (NOT raw JSON!)
   - Add these fields:

   | Key | Type | Value |
   |-----|------|-------|
   | `title` | Text | Blue Pottery Vase |
   | `description` | Text | Handcrafted blue pottery vase with traditional motifs |
   | `price` | Text | 2500 |
   | `category` | Text | Pottery |
   | `artisanId` | Text | `507f1f77bcf86cd799439011` (use a real ObjectId from MongoDB) |
   | `artisanName` | Text | Rajesh Kumar |
   | `location` | Text | Jaipur, Rajasthan |
   | `stock` | Text | 10 |
   | `images` | File | Select image file(s) - can upload up to 6 |

5. **Add Images:**
   - Click the dropdown next to `images` key
   - Change from "Text" to **"File"**
   - Click **"Select Files"** and choose 1-6 product images

6. **Send Request:**
   - Click **Send**
   - You should get a 201 response with the created product JSON

---

### Option B: Using Thunder Client (VS Code Extension)

1. **Install Thunder Client** from VS Code Extensions

2. **Create New Request:**
   - Click Thunder Client icon in sidebar
   - Click **"New Request"**

3. **Configure Request:**
   - Method: `POST`
   - URL: `http://localhost:5001/api/products/test`

4. **Set Body:**
   - Go to **Body** tab
   - Select **Form** (multipart/form-data)
   - Add fields:

   ```
   title: Blue Pottery Vase
   description: Handcrafted blue pottery vase with traditional motifs
   price: 2500
   category: Pottery
   artisanId: 507f1f77bcf86cd799439011
   artisanName: Rajesh Kumar
   location: Jaipur, Rajasthan
   stock: 10
   ```

5. **Add Images:**
   - Click **"Add File"** button
   - Select your product image(s)
   - The file field should be named `images`

6. **Send:**
   - Click **Send** button
   - Check response for created product

---

## Getting a Real Artisan ID

Before uploading, you need a valid `artisanId` (MongoDB ObjectId). You can:

### Option 1: Create an Artisan via API

```
POST http://localhost:5001/api/artisans/test
Content-Type: application/json

{
  "name": "Rajesh Kumar",
  "email": "rajesh@example.com",
  "location": "Jaipur, Rajasthan",
  "craftTypes": ["Pottery"],
  "bio": "Master potter with 20 years of experience"
}
```

Copy the `_id` from the response and use it as `artisanId`.

### Option 2: Use MongoDB Compass

1. Connect to your MongoDB Atlas cluster
2. Open `karigarai` database → `artisans` collection
3. Create a document or copy an existing `_id`
4. Use that `_id` as `artisanId`

---

## Production Endpoint (With Clerk Auth)

Once you're ready to use the real endpoint with authentication:

### Endpoint
```
POST http://localhost:5001/api/products
```

### Get Clerk Token from Browser Console

1. Open your frontend app (`http://localhost:5173`)
2. Sign in via Clerk
3. Open browser console (F12)
4. Run this code:

```javascript
import { useAuth } from '@clerk/clerk-react';
// Or if you have access to Clerk instance:
const { getToken } = useAuth();
getToken().then(token => console.log('Token:', token));
```

5. Copy the token from console
6. In Postman/Thunder Client:
   - Add Header: `Authorization: Bearer <your-token-here>`

---

## Example Response

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Blue Pottery Vase",
  "description": "Handcrafted blue pottery vase...",
  "price": 2500,
  "category": "Pottery",
  "artisanId": "507f1f77bcf86cd799439011",
  "artisanName": "Rajesh Kumar",
  "location": "Jaipur, Rajasthan",
  "images": [
    "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/vase.jpg"
  ],
  "stock": 10,
  "views": 0,
  "createdAt": "2025-01-27T10:30:00.000Z",
  "updatedAt": "2025-01-27T10:30:00.000Z"
}
```

---

## Troubleshooting

- **400 Bad Request**: Check that all required fields are present and valid
- **500 Error**: Make sure Cloudinary credentials are in `backend/.env`
- **Connection Refused**: Ensure backend is running (`npm run dev` in `backend/` folder)
- **Images not uploading**: Verify `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` are set in `.env`

---

## Remove Test Endpoint in Production

⚠️ **Important**: The `/api/products/test` endpoint has no authentication. Remove it before deploying to production!

Delete these lines from `backend/routes/products.js`:

```javascript
// TEST ENDPOINT: POST /api/products/test (no auth required - for testing only)
router.post(
  '/test',
  upload.array('images', 6),
  validate(createProductBodySchema),
  createProduct
);
```
