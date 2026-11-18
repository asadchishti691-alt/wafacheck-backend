require('dotenv').config();

const missing = ['JWT_SECRET', 'ADMIN_USERNAME', 'ADMIN_PASSWORD', 'ALLOWED_ORIGINS'].filter(
  (k) => !process.env[k]
);
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}
if (process.env.JWT_SECRET.length < 32) {
  console.error('JWT_SECRET must be at least 32 characters.');
  process.exit(1);
}
if (process.env.ADMIN_PASSWORD.length < 12) {
  console.error('ADMIN_PASSWORD must be at least 12 characters.');
  process.exit(1);
}

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',')
  .map((o) => o.trim().replace(/\/+$/, ''))
  .filter(Boolean);

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,
  allowedOrigins,
  adminUsername: process.env.ADMIN_USERNAME,
  adminPassword: process.env.ADMIN_PASSWORD,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  notifyWebhookUrl: process.env.NOTIFY_WEBHOOK_URL || '',
  maxRequests: Number(process.env.MAX_REQUESTS) || 2000,
  maxReviews: Number(process.env.MAX_REVIEWS) || 1000,
};
