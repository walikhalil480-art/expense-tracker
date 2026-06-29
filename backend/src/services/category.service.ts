import { Prisma } from '@prisma/client';
import prisma from '../prisma/client';
import { AppError } from '../utils/AppError';
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../validators/category.validator';

export const createCategory = async (userId: string, data: CreateCategoryInput) => {
  const existingCategory = await prisma.category.findUnique({
    where: { userId_name: { userId, name: data.name } },
  });
  if (existingCategory) {
    throw new AppError('Category with this name already exists', 400);
  }
  return prisma.category.create({
    data: {
      name: data.name,
      color: data.color ?? null,
      userId,
    },
  });
};

export const getCategories = async (userId: string) => {
  return prisma.category.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
  });
};

export const updateCategory = async (
  userId: string,
  categoryId: string,
  data: UpdateCategoryInput
) => {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId },
  });
  if (!category) throw new AppError('Category not found', 404);

  const updateData: Prisma.CategoryUpdateInput = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.color !== undefined) updateData.color = data.color;

  return prisma.category.update({
    where: { id: categoryId },
    data: updateData,
  });
};

export const deleteCategory = async (userId: string, categoryId: string) => {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId },
  });
  if (!category) throw new AppError('Category not found', 404);

  await prisma.category.delete({
    where: { id: categoryId },
  });
};
