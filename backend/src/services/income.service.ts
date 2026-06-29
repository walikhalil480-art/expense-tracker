import { Prisma } from '@prisma/client';
import prisma from '../prisma/client';
import { AppError } from '../utils/AppError';
import type {
  CreateIncomeInput,
  IncomeQuery,
  UpdateIncomeInput,
} from '../validators/income.validator';

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

const buildIncomeWhere = (userId: string, query: IncomeQuery): Prisma.IncomeWhereInput => {
  const where: Prisma.IncomeWhereInput = { userId };

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

const buildIncomeCreateData = (
  userId: string,
  data: CreateIncomeInput
): Prisma.IncomeUncheckedCreateInput => ({
  userId,
  amount: data.amount,
  source: data.source,
  date: toDate(data.date),
  categoryId: data.categoryId,
});

const buildIncomeUpdateData = (data: UpdateIncomeInput): Prisma.IncomeUncheckedUpdateInput => {
  const updateData: Prisma.IncomeUncheckedUpdateInput = {};

  if (data.amount !== undefined) updateData.amount = data.amount;
  if (data.source !== undefined) updateData.source = data.source;
  if (data.date !== undefined) updateData.date = new Date(data.date);
  if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;

  return updateData;
};

export const createIncome = async (userId: string, data: CreateIncomeInput) => {
  await ensureCategoryBelongsToUser(userId, data.categoryId);

  return prisma.income.create({
    data: buildIncomeCreateData(userId, data),
  });
};

export const getIncomes = async (userId: string, query: IncomeQuery) => {
  const page = parsePositiveInteger(query.page, 1);
  const limit = parsePositiveInteger(query.limit, 10);
  const sort = query.sort ?? 'date';
  const order: Prisma.SortOrder = query.order ?? 'desc';
  const skip = (page - 1) * limit;
  const where = buildIncomeWhere(userId, query);
  const orderBy: Prisma.IncomeOrderByWithRelationInput = { [sort]: order };

  const [incomes, total] = await Promise.all([
    prisma.income.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: { category: true },
    }),
    prisma.income.count({ where }),
  ]);

  return { incomes, total, page, limit };
};

export const getIncomeById = async (userId: string, incomeId: string) => {
  const income = await prisma.income.findFirst({
    where: { id: incomeId, userId },
    include: { category: true },
  });
  if (!income) throw new AppError('Income not found', 404);
  return income;
};

export const updateIncome = async (
  userId: string,
  incomeId: string,
  data: UpdateIncomeInput
) => {
  const income = await prisma.income.findFirst({
    where: { id: incomeId, userId },
  });
  if (!income) throw new AppError('Income not found', 404);

  await ensureCategoryBelongsToUser(userId, data.categoryId);

  return prisma.income.update({
    where: { id: incomeId },
    data: buildIncomeUpdateData(data),
  });
};

export const deleteIncome = async (userId: string, incomeId: string) => {
  const income = await prisma.income.findFirst({
    where: { id: incomeId, userId },
  });
  if (!income) throw new AppError('Income not found', 404);

  await prisma.income.delete({
    where: { id: incomeId },
  });
};
