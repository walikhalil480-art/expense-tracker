import { z } from 'zod';
import {
  dateStringSchema,
  positiveIntegerStringSchema,
  sortOrderSchema,
} from './common.validator';

const incomeIdParamsSchema = z.object({
  id: z.string().uuid('Invalid income ID'),
});

const incomeSortFieldSchema = z.enum(['date', 'amount', 'source']);

const incomeQuerySchema = z.object({
  page: positiveIntegerStringSchema.optional(),
  limit: positiveIntegerStringSchema.optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),
  startDate: dateStringSchema.optional(),
  endDate: dateStringSchema.optional(),
  sort: incomeSortFieldSchema.optional(),
  order: sortOrderSchema.optional(),
});

const createIncomeBodySchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  source: z.string().optional(),
  date: dateStringSchema.optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),
});

const updateIncomeBodySchema = z.object({
  amount: z.number().positive('Amount must be positive').optional(),
  source: z.string().optional(),
  date: dateStringSchema.optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),
});

export const createIncomeSchema = z.object({
  body: createIncomeBodySchema,
});

export const getIncomesSchema = z.object({
  query: incomeQuerySchema,
});

export const incomeIdSchema = z.object({
  params: incomeIdParamsSchema,
});

export const updateIncomeSchema = z.object({
  params: incomeIdParamsSchema,
  body: updateIncomeBodySchema,
});

export type CreateIncomeInput = z.infer<typeof createIncomeBodySchema>;
export type UpdateIncomeInput = z.infer<typeof updateIncomeBodySchema>;
export type IncomeQuery = z.infer<typeof incomeQuerySchema>;
