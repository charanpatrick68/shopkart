const test = require('node:test');
const assert = require('node:assert/strict');
const Product = require('../models/product.model');
const {
  normalizeShippingAddress,
  getCartItemsForOrder,
} = require('../controllers/order.controller');

test('checkout uses safe default shipping data when no shipping details are provided', () => {
  const shipping = normalizeShippingAddress({});

  assert.equal(shipping.fullName, 'Customer');
  assert.equal(shipping.phone, '0000000000');
  assert.equal(shipping.addressLine1, 'Not provided');
  assert.equal(shipping.city, 'Not provided');
  assert.equal(shipping.state, 'Not provided');
  assert.equal(shipping.pincode, '000000');
});

test('cart validation accepts populated product documents in the customer cart', async () => {
  const originalFind = Product.find;
  const productId = '507f1f77bcf86cd799439011';

  Product.find = function (query) {
    assert.deepEqual(query._id.$in, [productId]);
    return {
      lean() {
        return [{
          _id: productId,
          name: 'Test Product',
          price: 499,
          stock: 12,
          image: 'https://example.com/test.jpg',
        }];
      },
    };
  };

  try {
    const customer = {
      cart: [{
        product: {
          _id: productId,
          name: 'Test Product',
          price: 499,
          stock: 12,
          image: 'https://example.com/test.jpg',
        },
        quantity: 2,
      }],
    };

    const items = await getCartItemsForOrder(customer);

    assert.equal(items.length, 1);
    assert.equal(items[0].name, 'Test Product');
    assert.equal(items[0].quantity, 2);
    assert.equal(items[0].price, 499);
  } finally {
    Product.find = originalFind;
  }
});
