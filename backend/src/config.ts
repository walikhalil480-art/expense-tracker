import * as dotenv from 'dotenv';

dotenv.config();

const parsePort = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const parseCorsOrigins = (): string[] => {
  if (process.env.CORS_ORIGIN) {
    return process.env.CORS_ORIGIN.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);
  }

  return [process.env.FRONTEND_URL || 'http://localhost:3001'];
};

export const config = {
  port: parsePort(process.env.PORT, 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'change_this_secret',
  dbUrl: process.env.DATABASE_URL
    || 'postgresql://postgres:password@db:5432/expense_tracker?schema=public',
  corsOrigin: parseCorsOrigins(),
  rateLimitWindowMs: 60 * 1000,
  rateLimitMax: 100,
};
