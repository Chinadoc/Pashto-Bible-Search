/**
 * Quick test script to verify R2 connection
 */
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

const R2_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const R2_ENDPOINT = process.env.CLOUDFLARE_R2_ENDPOINT;

console.log('Testing R2 credentials...');
console.log('Account ID:', R2_ACCOUNT_ID ? '✅ Set' : '❌ Missing');
console.log('Access Key:', R2_ACCESS_KEY_ID ? '✅ Set' : '❌ Missing');
console.log('Secret Key:', R2_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Missing');
console.log('Endpoint:', R2_ENDPOINT || 'Using default');

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.error('\n❌ Missing credentials');
  process.exit(1);
}

console.log('\n✅ All credentials present!');
console.log('\nTo test the connection, we need @aws-sdk/client-s3 installed.');
console.log('Try: npm install @aws-sdk/client-s3');


