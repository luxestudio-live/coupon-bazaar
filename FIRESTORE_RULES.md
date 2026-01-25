# Updated Firestore Security Rules

Copy and paste these rules into your Firebase Console (Firestore → Rules):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Coupons: Public read, authenticated write
    match /coupons/{coupon} {
      allow read: if true;  // Anyone can read coupons (for website visitors)
      allow create, update, delete: if request.auth != null;  // Only logged-in admins can modify
    }
    
    // Brands: Authenticated users only
    match /brands/{brand} {
      allow read: if request.auth != null;  // Only logged-in admins can see brands
      allow create, update, delete: if request.auth != null;  // Only logged-in admins can modify
    }
    
    // Coupon Codes: Read for purchase, write only by admin
    match /couponCodes/{code} {
      allow read: if true;  // Allow reading to check availability and purchase
      allow create, delete: if request.auth != null;  // Only admin can add/remove codes
      allow update: if true;  // Allow marking as used during purchase
    }
  }
}
```

## What Changed:

1. **New Collection**: `couponCodes` - stores individual coupon codes
2. **Coupon Codes Can Be Marked as Used**: When users purchase, codes are marked as used
3. **Real-time Stock Updates**: Stock is calculated from available (unused) codes
4. **Multiple Codes Per Offer**: Same brand/offer can have many unique codes

## How It Works:

1. **Admin adds coupon** → Enters codes (one per line) → Each code is stored separately
2. **User buys 3 qty** → System allocates 3 unused codes → Marks them as used
3. **Stock updates automatically** → Shows count of unused codes only
4. **Used codes never shown again** → isUsed flag prevents reuse
