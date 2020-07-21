require('dotenv').config({ path: './tests/.env.test' });

if (process.env.NODE_ENV !== 'test') {
  throw Error('Non-test environment');
}
