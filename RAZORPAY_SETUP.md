# Razorpay Payment Integration Setup

## Steps to Configure Razorpay

### 1. Create Razorpay Account
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up or log in
3. Complete KYC verification (required for live mode)

### 2. Get API Keys
1. Navigate to **Settings** → **API Keys**
2. Generate keys for **Test Mode** (for development)
3. Copy both:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret**

### 3. Configure Environment Variables
1. Create `.env.local` file in project root
2. Add your Razorpay credentials:

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

**Note**: 
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` is safe to expose (public key)
- `RAZORPAY_KEY_SECRET` must be kept secret (never commit to git)

### 4. Test Mode vs Live Mode

#### Test Mode (Development)
- Use test keys (prefixed with `rzp_test_`)
- Use test cards provided by Razorpay
- No real money transactions

**Test Card Details:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date
- Name: Any name

#### Live Mode (Production)
1. Complete KYC verification
2. Get live keys from dashboard (prefixed with `rzp_live_`)
3. Replace test keys with live keys in `.env.local`
4. Enable payment methods in dashboard

### 5. Payment Flow

1. **User adds items to cart** → Click checkout
2. **Checkout page** → Shows order summary + payment form
3. **User enters details** → Name, email, phone
4. **Click "Pay"** → Creates Razorpay order
5. **Razorpay modal opens** → User selects payment method (UPI/Card/NetBanking)
6. **Payment completed** → Webhook verifies payment
7. **Success page** → Shows coupon codes

### 6. Security Features

- ✅ Payment signature verification
- ✅ Server-side order creation
- ✅ Secure key storage
- ✅ HTTPS required for production

### 7. Webhooks (Optional)

For production, set up webhooks to handle:
- Payment success/failure
- Refunds
- Disputes

**Webhook URL**: `https://yourdomain.com/api/webhook/razorpay`

### 8. Supported Payment Methods

- UPI (GPay, PhonePe, Paytm)
- Credit/Debit Cards
- NetBanking
- Wallets (Paytm, Mobikwik, etc.)

### 9. Fees

Razorpay charges:
- **2% + ₹0** per transaction (domestic)
- Varies for international payments
- Check latest pricing: https://razorpay.com/pricing/

### 10. Testing

Test with different payment methods:
```
UPI: success@razorpay (succeeds)
UPI: failure@razorpay (fails)
Cards: Use test card numbers from docs
```

## Important Notes

⚠️ **Never commit `.env.local` to git**  
⚠️ **Use test mode for development**  
⚠️ **Complete KYC before going live**  
⚠️ **Enable HTTPS in production**

## Troubleshooting

**Issue**: Razorpay modal not opening
- Solution: Check if `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set correctly

**Issue**: Payment verification failing
- Solution: Verify `RAZORPAY_KEY_SECRET` is correct

**Issue**: "Key ID is invalid"
- Solution: Ensure you're using correct key for mode (test/live)

## Resources

- [Razorpay Docs](https://razorpay.com/docs/)
- [API Reference](https://razorpay.com/docs/api/)
- [Test Cards](https://razorpay.com/docs/payments/payments/test-card-details/)
- [Support](https://razorpay.com/support/)
