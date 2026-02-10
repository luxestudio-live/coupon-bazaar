# Security Guide - ShopEase By TryLooters

## ⚠️ Important: Do NOT share credentials!

This guide covers the security measures in place and what you need to do before deploying.

## Setup Instructions

### 1. Create `.env.local` File

Copy `.env.local.example` and rename it to `.env.local`:

```bash
cp .env.local.example .env.local
```

### 2. Fill in Your Credentials

Edit `.env.local` and add your actual credentials:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_key_from_firebase_console
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Admin Credentials (Create a strong password)
ADMIN_EMAIL=your_admin_email@domain.com
ADMIN_PASSWORD=your_very_secure_password_here

# Razorpay (for payment processing)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 3. Get Your Credentials

**Firebase:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project → Project Settings
3. Copy the Web API credentials

**Razorpay:**
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to Settings → API Keys
3. Copy your test/live keys

## What's Protected

✅ `.env.local` is in `.gitignore` - It won't be committed
✅ All credentials are loaded from environment variables
✅ Only public Firebase keys are exposed (safe to share)
✅ Secret keys stored only in `.env.local`

## Deployment

### For Production (Vercel/Other Platforms)

1. **Set Environment Variables** in your deployment platform's dashboard:
   - Go to Settings → Environment Variables
   - Add all variables from `.env.local.example`
   - Use **production credentials** (not test keys)

2. **Do NOT** add `.env.local` to your repository

3. **Use Different Keys** for different environments:
   - Development: Test keys (Firebase + Razorpay)
   - Production: Live keys (Firebase + Razorpay)

## Security Checklist

- [ ] Remove hardcoded credentials from codebase
- [ ] Create `.env.local` with your credentials
- [ ] Add it to `.gitignore` (already done)
- [ ] Test locally with `pnpm dev`
- [ ] For production, set environment variables in your hosting platform
- [ ] Rotate admin password after initial setup
- [ ] Use strong, unique admin password
- [ ] Enable 2FA on Firebase and Razorpay accounts

## If Credentials Are Exposed

If you accidentally commit credentials to GitHub:

1. **Immediately rotate all exposed keys:**
   - Firebase: Regenerate API keys
   - Razorpay: Regenerate API keys
   - Admin: Change password

2. **Clean git history:**
   ```bash
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch .env.local" \
   --prune-empty -- --all
   ```

3. **Push changes:**
   ```bash
   git push origin --force --all
   ```

## Questions?

Refer to the setup guides:
- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
- [RAZORPAY_SETUP.md](./RAZORPAY_SETUP.md)
