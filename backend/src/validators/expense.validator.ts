import { z } from 'zod';
import {
  dateStringSchema,
  positiveIntegerStringSchema,
  sortOrderSchema,
} from './common.validator';

const expenseIdParamsSchema = z.object({
  id: z.string().uuid('Invalid expense ID'),
});

const expenseSortFieldSchema = z.enum(['date', 'amount', 'description']);

const expenseQuerySchema = z.object({
  page: positiveIntegerStringSchema.optional(),
  limit: positiveIntegerStringSchema.optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),
  startDate: dateStringSchema.optional(),
  endDate: dateStringSchema.optional(),
  sort: expenseSortFieldSchema.optional(),
  order: sortOrderSchema.optional(),
});

const createExpenseBodySchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  description: z.string().optional(),
  date: dateStringSchema.optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),
});

const updateExpenseBodySchema = z.object({
  amount: z.number().positive('Amount must be positive').optional(),
  description: z.string().optional(),
  date: dateStringSchema.optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),
});

export const createExpenseSchema = z.object({
  body: createExpenseBodySchema,
});

export const getExpensesSchema = z.object({
  query: expenseQuerySchema,
});

export const expenseIdSchema = z.object({
  params: expenseIdParamsSchema,
});

export const updateExpenseSchema = z.object({
  params: expenseIdParamsSchema,
  body: updateExpenseBodySchema,
});

export type CreateExpenseInput = z.infer<typeof createExpenseBodySchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseBodySchema>;
export type ExpenseQuery = z.infer<typeof expenseQuerySchema>;
