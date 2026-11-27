# Environment Variables Setup Guide

## Required Environment Variables

Add these to your `.env.local` file:

```
# MongoDB Connection
MONGO_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/furniture-db

# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-here-change-it-in-production
```

## How to get your MongoDB URI:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and database
3. Click "Connect" and select "Drivers"
4. Copy your connection string
5. Replace `<username>` and `<password>` with your database credentials

## How the migration works:

### Before (Node.js):

- Backend API: `http://localhost:5000/api`
- Controllers handled requests

### After (Next.js):

- API Routes: `/api/...` (same domain as frontend)
- Database connection: `src/lib/db.ts`
- Models: `src/lib/models/`
- API client calls: `src/lib/api/`

## API Endpoints:

### Authentication

- `POST /api/auth/login` - Admin login

### Products

- `GET /api/products` - Get all products (supports `?categoryId=xxx` filter)
- `POST /api/products` - Create product (FormData)
- `GET /api/products/[id]` - Get single product
- `PUT /api/products/[id]` - Update product (FormData)
- `DELETE /api/products/[id]` - Delete product

### Categories

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (FormData)
- `GET /api/categories/[id]` - Get single category
- `PUT /api/categories/[id]` - Update category (FormData)
- `DELETE /api/categories/[id]` - Delete category

## Starting the app:

```bash
npm run dev
```

Access at `http://localhost:3000`

All API calls are now local to the Next.js app, no external backend needed!
