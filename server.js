const config = require('./config');
const app = require('./app');

const server = app.listen(config.port, () => {
  console.log(`Wafacheck API listening on port ${config.port} (${config.env})`);
});

const shutdown = (signal) => {
  console.log(`${signal} received, shutting down`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000).unref();
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (e) => console.error('Unhandled rejection:', e && e.message));
