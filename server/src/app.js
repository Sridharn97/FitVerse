const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

const parseCsv = (value) =>
  String(value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

const DEV_DEFAULT_ORIGINS = new Set([
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
]);

const configuredOrigins = new Set(parseCsv(process.env.CORS_ORIGINS));
const isProd = process.env.NODE_ENV === 'production';
const allowAllInDev = String(process.env.CORS_ALLOW_ALL || '').toLowerCase() === 'true';

const corsOptions = {
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // non-browser clients (curl/Postman) or same-origin
    if (!isProd && allowAllInDev) return callback(null, true);

    const allowList = isProd
      ? configuredOrigins
      : new Set([...DEV_DEFAULT_ORIGINS, ...configuredOrigins]);

    if (allowList.has(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`), false);
  },
};

app.use(helmet());
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'Backend is healthy' });
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
