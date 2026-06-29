import { z } from 'zod';

const categoryIdParamsSchema = z.object({
  id: z.string().uuid('Invalid category ID'),
});

const createCategoryBodySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  color: z.string().optional(),
});

const updateCategoryBodySchema = z.object({
  name: z.string().min(1, 'Category name is required').optional(),
  color: z.string().optional(),
});

export const createCategorySchema = z.object({
  body: createCategoryBodySchema,
});

export const categoryIdSchema = z.object({
  params: categoryIdParamsSchema,
});

export const updateCategorySchema = z.object({
  params: categoryIdParamsSchema,
  body: updateCategoryBodySchema,
});

export type CreateCategoryInput = z.infer<typeof createCategoryBodySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategoryBodySchema>;
