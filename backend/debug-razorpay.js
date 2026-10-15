require('dotenv').config();
const Razorpay = require('razorpay');

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

console.log('KEY_ID', keyId);
console.log('KEY_SECRET_PRESENT', !!keySecret);

const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

razorpay.orders.create({
  amount: 100,
  currency: 'INR',
  receipt: 'debug_receipt_1',
}).then((res) => {
  console.log('SUCCESS', res && res.id);
}).catch((err) => {
  console.error('ERROR_MESSAGE', err && err.message);
  console.error('ERROR_BODY', err && err.error);
  process.exit(1);
});
