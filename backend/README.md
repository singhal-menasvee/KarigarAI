# KarigarAI Backend (Phase 1)

Express + MongoDB (Mongoose) API for the KarigarAI marketplace.

## Folder structure

```
backend/
  config/
  controllers/
  middleware/
  models/
  routes/
  server.js
  env.example
```

## Setup (local dev)

1) Create a `backend/.env` file (not committed) using `backend/env.example` as reference.

2) Install deps:

```bash
cd backend
npm install
```

3) Start server:

```bash
npm run dev
```

Server runs on `PORT` (default `5001`).

## Environment variables

- `MONGODB_URI`: required (MongoDB Atlas connection string)
- `FRONTEND_ORIGIN`: CORS allowlist origin (default `http://localhost:5173`)
- `CLOUDINARY_*`: optional unless you upload images
- `CLERK_ISSUER`: required to protect POST routes with Clerk JWT verification

## API routes

All routes are prefixed with `/api`.

- `GET /products`: list products
  - Optional query: `search`, `category`, `artisanId`, `page`, `limit`
- `GET /products/:id`: get product and increment `views`
- `POST /products`: create product (requires `Authorization: Bearer <Clerk session token>`)
  - Content-Type: `multipart/form-data`
  - Fields: `title`, `description`, `price`, `category`, `artisanId`, `artisanName`, `location`, `stock`
  - Files: `images` (up to 6)

- `POST /artisans`: create artisan profile (requires auth)
- `GET /artisans/:id`: fetch artisan profile
- `GET /artisans/:id/products`: fetch artisan's products

