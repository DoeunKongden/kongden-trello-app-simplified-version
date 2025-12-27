// check-env.js
require('dotenv').config();

const url = process.env.DATABASE_URL;
console.log('Current DATABASE_URL value:');
console.log(url);
console.log('\n--- Analysis ---');
console.log('Is it defined?', !!url);
console.log('Starts with postgresql://?', url?.startsWith('postgresql://'));
console.log('Starts with jdbc:?', url?.startsWith('jdbc:'));
console.log('Length:', url?.length);