# Stripe Test Mode Setup Guide

## 🔧 Setup Instructions

### 1. Create Stripe Account
1. Go to https://stripe.com
2. Sign up for a free account
3. Verify your email

### 2. Get Test API Keys
1. Login to Stripe Dashboard
2. Make sure you're in **Test Mode** (toggle in left sidebar)
3. Go to **Developers** → **API Keys**
4. Copy the following keys:
   - **Publishable Key**: `pk_test_...`
   - **Secret Key**: `sk_test_...`

### 3. Configure Environment Variables
Update your `.env` file:
```env
# Replace with your actual Stripe test keys
STRIPE_SECRET_KEY=sk_test_your_actual_test_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 4. Setup Webhook (Optional for local testing)
1. In Stripe Dashboard → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. URL: `http://localhost:5000/api/payment/verify`
4. Events: Select `checkout.session.completed`
5. Copy the **Signing Secret** to `STRIPE_WEBHOOK_SECRET`

---

## 🧪 Test Payment Flow

### Test Credit Cards (Stripe Test Mode)
- **Success**: `4242424242424242`
- **Declined**: `4000000000000002`
- **Requires Authentication**: `4000002500003155`
- **Insufficient Funds**: `4000000000009995`

### Test Details
- **Expiry**: Any future date (e.g., 12/34)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any 5 digits (e.g., 12345)

---

## 🔄 Payment Flow Testing

### 1. Create Test Course
```bash
# Login as instructor
# Create course with price > 0
# Publish the course
```

### 2. Test Purchase Flow
```bash
# Login as student
# Navigate to paid course
# Click "Buy Now"
# Use test card: 4242424242424242
# Complete payment
# Verify enrollment and access
```

### 3. Verify Database
Check these tables after successful payment:
- `payments` - Payment record with status 'completed'
- `enrollments` - New enrollment record
- User can access course content

---

## 🚨 Important Notes

### Security
- ✅ **Never** use real credit cards in test mode
- ✅ **Never** commit real API keys to version control
- ✅ Always use test keys for development
- ✅ Switch to live keys only in production

### Test Mode Features
- ✅ No real money is charged
- ✅ All payments are simulated
- ✅ Full Stripe dashboard access
- ✅ Webhook testing available
- ✅ All payment methods supported

### Production Checklist
- [ ] Replace test keys with live keys
- [ ] Update webhook URL to production domain
- [ ] Enable live mode in Stripe dashboard
- [ ] Test with small real transaction
- [ ] Set up proper error handling
- [ ] Configure payment failure notifications

---

## 🔍 Troubleshooting

### Common Issues
1. **"Invalid API Key"**
   - Check if key starts with `sk_test_`
   - Verify key is copied correctly
   - Ensure no extra spaces

2. **Webhook Not Working**
   - Check webhook URL is accessible
   - Verify signing secret matches
   - Test webhook in Stripe dashboard

3. **Payment Not Completing**
   - Check browser console for errors
   - Verify course exists and has price
   - Check user is not already enrolled

### Debug Steps
1. Check backend logs for errors
2. Verify Stripe dashboard for payment events
3. Check database for payment/enrollment records
4. Test with different browsers/devices

---

## 📚 Additional Resources
- [Stripe Test Cards](https://stripe.com/docs/testing#cards)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Checkout](https://stripe.com/docs/checkout)
- [Stripe Dashboard](https://dashboard.stripe.com/test)