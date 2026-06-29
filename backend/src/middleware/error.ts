import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';
import { config } from '../config';

const hasStatusCode = (error: unknown): error is { statusCode: number } => {
  return typeof error === 'object'
    && error !== null
    && 'statusCode' in error
    && typeof error.statusCode === 'number';
};

const normalizeError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  const statusCode = hasStatusCode(error) ? error.statusCode : 500;
  const message = error instanceof Error && error.message
    ? error.message
    : 'Internal Server Error';

  return new AppError(message, statusCode, false);
};

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  const error = normalizeError(err);
  const logMessage = `[${req.method}] ${req.originalUrl} >> StatusCode:: ${error.statusCode}, Message:: ${error.message}`;

  if (config.nodeEnv === 'development') {
    logger.error(logMessage, err instanceof Error ? err.stack : undefined);
  } else {
    logger.error(logMessage);
  }

  res.status(error.statusCode).json({
    status: 'error',
    message: error.message,
    ...(config.nodeEnv === 'development' && err instanceof Error && { stack: err.stack }),
  });
};
