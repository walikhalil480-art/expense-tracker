import { z } from 'zod';

export const dateStringSchema = z.string().refine(
  (value) => !Number.isNaN(Date.parse(value)),
  'Invalid date'
);

export const positiveIntegerStringSchema = z
  .string()
  .regex(/^[1-9]\d*$/, 'Must be a positive integer');

export const sortOrderSchema = z.enum(['asc', 'desc']);
