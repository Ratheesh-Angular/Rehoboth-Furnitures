# Migration Checklist ✅

## Database & Configuration

- [x] MongoDB connection created in `src/lib/db.ts`
- [x] Models migrated (Product, Category, Admin)
- [x] Cloudinary config created
- [x] `.env.local` file created with placeholders

## API Routes

- [x] Authentication route (`/api/auth/login`)
- [x] Product routes (GET, POST, PUT, DELETE)
- [x] Category routes (GET, POST, PUT, DELETE)

## API Client

- [x] `axios.ts` updated to use `/api` (local)
- [x] `auth.api.ts` endpoints updated
- [x] `product.api.ts` endpoints updated
- [x] `category.api.ts` endpoints updated

## Dependencies Installed

- [x] mongoose (MongoDB ODM)
- [x] bcryptjs (password hashing)
- [x] jsonwebtoken (JWT authentication)
- [x] cloudinary (image uploads)
- [x] streamifier (buffer stream conversion)

---

## 🔴 YOU MUST DO THESE STEPS

### Step 1: Add Environment Variables to `.env.local`

Edit `furniture-app/.env.local` and replace with your actual values:

```env
# MongoDB Connection (Get from MongoDB Atlas)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/furniture-db

# Generate a random string for JWT secret
JWT_SECRET=your-super-secret-key-change-this-in-production

# Cloudinary Setup (Get from https://cloudinary.com)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**How to get these values:**

**MongoDB URI:**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Click "Connect" → "Drivers"
4. Copy the connection string
5. Replace `<username>` and `<password>` with your credentials

**Cloudinary:**

1. Sign up at https://cloudinary.com
2. Go to Dashboard
3. Copy your Cloud Name, API Key, and API Secret

**JWT Secret:**

- Generate any random string (e.g., use a password generator)
- In production, use a strong random key

### Step 2: Test the Setup

```bash
cd "e:\Aiden Web Solutions\Rehoboth Furnitures - NEXT JS\furniture-app"
npm run dev
```

Go to `http://localhost:3000` and test:

- API routes are working
- Database connection is established
- No errors in console

### Step 3: Verify All Files Are Created

Check these files exist:

```
✓ src/lib/db.ts
✓ src/lib/models/Product.ts
✓ src/lib/models/Category.ts
✓ src/lib/models/Admin.ts
✓ src/lib/config/cloudinary.ts
✓ src/lib/utils/uploadImage.ts
✓ src/app/api/auth/login/route.ts
✓ src/app/api/products/route.ts
✓ src/app/api/products/[id]/route.ts
✓ src/app/api/categories/route.ts
✓ src/app/api/categories/[id]/route.ts
✓ .env.local (with your credentials)
```

### Step 4: Delete Node.js Backend (Optional)

Once everything is working, you can delete:

```
backend/
```

You no longer need the Node.js server!

---

## 🔍 Troubleshooting

**Problem: "MongoDB connection error"**

- Check your MONGO_URI is correct
- Make sure your IP is whitelisted in MongoDB Atlas
- Test the connection string directly

**Problem: "Cloudinary error"**

- Verify CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET are correct
- Make sure NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is correct

**Problem: "JWT_SECRET is undefined"**

- Check `.env.local` has JWT_SECRET set
- Restart dev server: `npm run dev`

**Problem: API routes return 500 errors**

- Check browser console and terminal for error messages
- Make sure `.env.local` is in the root of `furniture-app/` folder
- Verify models are in `src/lib/models/`

---

## 📞 API Testing

You can test endpoints using curl or Postman:

```bash
# Test auth login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Get all products
curl http://localhost:3000/api/products

# Get all categories
curl http://localhost:3000/api/categories
```

---

## 🎉 Done!

Your Next.js app now has:
✅ Full database integration
✅ API routes replacing Node.js backend
✅ Image upload capability
✅ Authentication system
✅ No need for separate backend server

Start developing! 🚀
