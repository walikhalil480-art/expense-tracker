import { RequestHandler } from 'express';
import { ZodError, ZodType } from 'zod';
import { AppError } from '../utils/AppError';

const formatZodError = (error: ZodError): string => {
  return error.issues
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join('.') : 'request';
      return `${path}: ${issue.message}`;
    })
    .join(', ');
};

export const validate = (schema: ZodType): RequestHandler => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new AppError(`Invalid input data. ${formatZodError(error)}`, 400));
        return;
      }

      next(error);
    }
  };
};
