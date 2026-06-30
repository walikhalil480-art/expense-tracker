import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

import authRouter from './routes/auth.route';
import expenseRouter from './routes/expense.route';
import categoryRouter from './routes/category.route';
import incomeRouter from './routes/income.route';
import dashboardRouter from './routes/dashboard.route';

import { errorHandler } from './middleware/error';
import { AppError } from './utils/AppError';
import logger from './utils/logger';
import { config } from './config';

const app = express();

/**
 * -----------------------------
 * SECURITY MIDDLEWARE
 * -----------------------------
 */
app.use(helmet());

/**
 * -----------------------------
 * CORS FIX (IMPORTANT PART)
 * -----------------------------
 */

const allowedOrigins = config.corsOrigin;

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, mobile apps)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
  ],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
/**
 * -----------------------------
 * BODY PARSERS
 * -----------------------------
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * -----------------------------
 * LOGGING
 * -----------------------------
 */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/**
 * -----------------------------
 * RATE LIMIT
 * -----------------------------
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use('/api', limiter);

/**
 * -----------------------------
 * ROOT ROUTE
 * -----------------------------
 */
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Expense Tracker API is running 🚀',
  });
});

/**
 * -----------------------------
 * ROUTES
 * -----------------------------
 */
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/expenses', expenseRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/incomes', incomeRouter);
app.use('/api/v1/dashboard', dashboardRouter);

/**
 * -----------------------------
 * 404 HANDLER
 * -----------------------------
 */
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

/**
 * -----------------------------
 * ERROR HANDLER
 * -----------------------------
 */
app.use(errorHandler);

/**
 * -----------------------------
 * START SERVER
 * -----------------------------
 */
const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

/**
 * -----------------------------
 * SAFETY HANDLERS
 * -----------------------------
 */
process.on('unhandledRejection', (err: Error) => {
  logger.error('UNHANDLED REJECTION! Shutting down...', err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err: Error) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...', err);
  process.exit(1);
});