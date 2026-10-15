const base = 'http://localhost:3000';

async function main() {
  const email = 'repro_' + Date.now() + '@mail.com';

  let res = await fetch(base + '/customers/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName: 'Repro User', email, password: '123456', phone: '9999999999' }),
  });
  console.log('REGISTER_STATUS', res.status);
  console.log('REGISTER_BODY', await res.text());

  res = await fetch(base + '/customers/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: '123456' }),
  });
  const setCookie = res.headers.get('set-cookie');
  console.log('LOGIN_STATUS', res.status);
  console.log('LOGIN_BODY', await res.text());
  console.log('SET_COOKIE', setCookie);

  const cookie = setCookie ? setCookie.split(';')[0] : '';

  res = await fetch(base + '/products');
  const products = await res.json();
  console.log('PRODUCTS_STATUS', res.status);
  console.log('PRODUCTS_COUNT', products.products?.length || 0);

  const productId = products.products[0]._id;
  res = await fetch(base + '/cart/' + productId, {
    method: 'POST',
    headers: { Cookie: cookie },
  });
  console.log('ADD_CART_STATUS', res.status);
  console.log('ADD_CART_BODY', await res.text());

  res = await fetch(base + '/orders/create-payment-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify({
      shippingAddress: {
        fullName: 'Customer',
        phone: '0000000000',
        addressLine1: 'Not provided',
        city: 'Not provided',
        state: 'Not provided',
        pincode: '000000',
      },
    }),
  });
  console.log('CREATE_ORDER_STATUS', res.status);
  console.log('CREATE_ORDER_BODY', await res.text());
}

main().catch((err) => {
  console.error('SCRIPT_ERROR', err);
  process.exit(1);
});
