const test = require('node:test');
const assert = require('node:assert/strict');
const Customer = require('../models/customer.model');

test('Customer schema includes a valid cart structure', () => {
  const cartField = Customer.schema.obj.cart;

  assert.ok(Array.isArray(cartField), 'cart should be an array field');
  assert.equal(cartField.length, 1, 'cart should have one item schema definition');

  const cartItem = cartField[0];
  assert.equal(cartItem.product.ref, 'Product');
  assert.equal(cartItem.quantity.default, 1);
  assert.equal(cartItem.quantity.min[0], 1);
});
