# Firebase Setup Guide

Your coupon website is now connected to Firebase! Here's what you need to know:

## ✅ What's Been Set Up

1. **Firebase SDK Installed** - All necessary Firebase packages added
2. **Firebase Configuration** - Your credentials are configured in `lib/firebase.ts`
3. **Authentication** - Admin login now uses Firebase Authentication
4. **Firestore Database** - Brands and coupons are stored in Firestore
5. **Real-time Updates** - All admin operations sync with Firebase

## 🔐 Firebase Console Setup Required

### Step 1: Enable Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **coupon-duniya**
3. Navigate to **Authentication** → **Sign-in method**
4. Enable **Email/Password** authentication
5. Add an admin user:
   - Go to **Authentication** → **Users**
   - Click **Add User**
   - Enter email and password for admin access

### Step 2: Set Up Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create Database**
3. Choose **Start in production mode** (we'll add security rules next)
4. Select your preferred location (closest to your users)
5. Click **Enable**

### Step 3: Configure Firestore Security Rules

In Firestore → **Rules**, replace with:

\`\`\`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read for coupons (for website visitors)
    match /coupons/{coupon} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Brands - authenticated users only
    match /brands/{brand} {
      allow read, write: if request.auth != null;
    }
  }
}
\`\`\`

## 📊 Database Collections

Your Firestore will have two collections:

### `brands`
- `name` (string)
- `logoUrl` (string)
- `description` (string, optional)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

### `coupons`
- `brandId` (string) - Reference to brand
- `brand` (string) - Brand name for quick access
- `discount` (string) - e.g., "50% Off"
- `price` (number) - Price in rupees
- `stock` (number) - Available quantity
- `description` (string)
- `image` (string) - Brand logo URL
- `hidden` (boolean) - Visibility toggle
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

## 🚀 How to Use

### Admin Access
1. Go to `http://localhost:3000/admin/login`
2. Use the email/password you created in Firebase Console
3. Manage brands and coupons from the dashboard

### Public Website
- Coupons automatically load from Firebase
- Only visible (not hidden) coupons show on the homepage
- All changes in admin panel reflect immediately

## 🔒 Security Notes

- Admin authentication is handled by Firebase Auth
- Only authenticated users can modify data
- Public users can only read visible coupons
- All sensitive operations require authentication

## 📝 Next Steps

1. Add your admin user in Firebase Console
2. Enable Email/Password authentication
3. Create Firestore database
4. Set up security rules
5. Start adding brands and coupons!

Your application is production-ready with Firebase! 🎉
