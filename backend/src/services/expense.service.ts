import { Prisma } from '@prisma/client';
import prisma from '../prisma/client';
import { AppError } from '../utils/AppError';
import type {
  CreateExpenseInput,
  ExpenseQuery,
  UpdateExpenseInput,
} from '../validators/expense.validator';

const parsePositiveInteger = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const toDate = (value: string | undefined): Date | undefined => {
  return value ? new Date(value) : undefined;
};

const ensureCategoryBelongsToUser = async (
  userId: string,
  categoryId: string | undefined
): Promise<void> => {
  if (!categoryId) {
    return;
  }

  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId },
    select: { id: true },
  });

  if (!category) {
    throw new AppError('Category not found', 404);
  }
};

const buildExpenseWhere = (userId: string, query: ExpenseQuery): Prisma.ExpenseWhereInput => {
  const where: Prisma.ExpenseWhereInput = { userId };

  if (query.categoryId) {
    where.categoryId = query.categoryId;
  }

  const dateFilter: Prisma.DateTimeFilter = {};
  const startDate = toDate(query.startDate);
  const endDate = toDate(query.endDate);

  if (startDate) {
    dateFilter.gte = startDate;
  }

  if (endDate) {
    dateFilter.lte = endDate;
  }

  if (dateFilter.gte || dateFilter.lte) {
    where.date = dateFilter;
  }

  return where;
};

const buildExpenseCreateData = (
  userId: string,
  data: CreateExpenseInput
): Prisma.ExpenseUncheckedCreateInput => ({
  userId,
  amount: data.amount,
  description: data.description,
  date: toDate(data.date),
  categoryId: data.categoryId,
});

const buildExpenseUpdateData = (data: UpdateExpenseInput): Prisma.ExpenseUncheckedUpdateInput => {
  const updateData: Prisma.ExpenseUncheckedUpdateInput = {};

  if (data.amount !== undefined) updateData.amount = data.amount;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.date !== undefined) updateData.date = new Date(data.date);
  if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;

  return updateData;
};

export const createExpense = async (userId: string, data: CreateExpenseInput) => {
  await ensureCategoryBelongsToUser(userId, data.categoryId);

  return prisma.expense.create({
    data: buildExpenseCreateData(userId, data),
  });
};

export const getExpenses = async (userId: string, query: ExpenseQuery) => {
  const page = parsePositiveInteger(query.page, 1);
  const limit = parsePositiveInteger(query.limit, 10);
  const sort = query.sort ?? 'date';
  const order: Prisma.SortOrder = query.order ?? 'desc';
  const skip = (page - 1) * limit;
  const where = buildExpenseWhere(userId, query);
  const orderBy: Prisma.ExpenseOrderByWithRelationInput = { [sort]: order };

  const [expenses, total] = await Promise.all([
    prisma.expense.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: { category: true },
    }),
    prisma.expense.count({ where }),
  ]);

  return { expenses, total, page, limit };
};

export const getExpenseById = async (userId: string, expenseId: string) => {
  const expense = await prisma.expense.findFirst({
    where: { id: expenseId, userId },
    include: { category: true },
  });
  if (!expense) throw new AppError('Expense not found', 404);
  return expense;
};

export const updateExpense = async (
  userId: string,
  expenseId: string,
  data: UpdateExpenseInput
) => {
  const expense = await prisma.expense.findFirst({
    where: { id: expenseId, userId },
  });
  if (!expense) throw new AppError('Expense not found', 404);

  await ensureCategoryBelongsToUser(userId, data.categoryId);

  return prisma.expense.update({
    where: { id: expenseId },
    data: buildExpenseUpdateData(data),
  });
};

export const deleteExpense = async (userId: string, expenseId: string) => {
  const expense = await prisma.expense.findFirst({
    where: { id: expenseId, userId },
  });
  if (!expense) throw new AppError('Expense not found', 404);

  await prisma.expense.delete({
    where: { id: expenseId },
  });
};
