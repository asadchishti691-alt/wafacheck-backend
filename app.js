const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');
const { notFound, errorHandler } = require('./middleware/errors');

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1); // behind one proxy (Render, Railway, Fly, Heroku...)

app.use(helmet());

app.use(
  cors({
    origin(origin, cb) {
      // No Origin header = server-to-server / curl / health probes: allowed.
      if (!origin || config.allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error('Origin not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 600,
  })
);

app.use(express.json({ limit: '20kb' }));

// Health check (no auth, no data)
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: Math.round(process.uptime()), timestamp: new Date().toISOString() });
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});

// Tighter limit for public submissions to reduce spam
const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many submissions. Please try again later.' },
});

app.use('/api', apiLimiter);
app.post('/api/requests', submitLimiter);
app.post('/api/reviews', submitLimiter);

app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
