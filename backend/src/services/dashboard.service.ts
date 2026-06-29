import { Prisma } from '@prisma/client';
import prisma from '../prisma/client';
import type { DashboardSummaryQuery } from '../validators/dashboard.validator';

const buildDateFilter = (query: DashboardSummaryQuery): Prisma.DateTimeFilter | undefined => {
  const dateFilter: Prisma.DateTimeFilter = {};

  if (query.startDate) {
    dateFilter.gte = new Date(query.startDate);
  }

  if (query.endDate) {
    dateFilter.lte = new Date(query.endDate);
  }

  return dateFilter.gte || dateFilter.lte ? dateFilter : undefined;
};

export const getDashboardSummary = async (userId: string, query: DashboardSummaryQuery) => {
  const dateFilter = buildDateFilter(query);
  const expenseWhere: Prisma.ExpenseWhereInput = { userId };
  const incomeWhere: Prisma.IncomeWhereInput = { userId };

  if (dateFilter) {
    expenseWhere.date = dateFilter;
    incomeWhere.date = dateFilter;
  }

  const [totalExpensesResult, totalIncomesResult] = await Promise.all([
    prisma.expense.aggregate({
      where: expenseWhere,
      _sum: { amount: true },
    }),
    prisma.income.aggregate({
      where: incomeWhere,
      _sum: { amount: true },
    }),
  ]);

  const totalExpense = totalExpensesResult._sum.amount ? Number(totalExpensesResult._sum.amount) : 0;
  const totalIncome = totalIncomesResult._sum.amount ? Number(totalIncomesResult._sum.amount) : 0;
  const remainingBalance = totalIncome - totalExpense;

  const expensesByCategoryRaw = await prisma.expense.groupBy({
    by: ['categoryId'],
    where: expenseWhere,
    _sum: { amount: true },
  });

  const categories = await prisma.category.findMany({ where: { userId } });
  
  const expensesByCategory = expensesByCategoryRaw.map(item => {
    const category = categories.find(c => c.id === item.categoryId);
    return {
      category: category ? category.name : 'Uncategorized',
      amount: item._sum.amount ? Number(item._sum.amount) : 0,
      color: category?.color ?? '#cccccc',
    };
  });

  const [recentExpenses, recentIncomes] = await Promise.all([
    prisma.expense.findMany({
      where: expenseWhere,
      orderBy: { date: 'desc' },
      take: 5,
      include: { category: true },
    }),
    prisma.income.findMany({
      where: incomeWhere,
      orderBy: { date: 'desc' },
      take: 5,
    }),
  ]);

  const allTransactions = [
    ...recentExpenses.map(e => ({ ...e, type: 'EXPENSE', amount: Number(e.amount) })),
    ...recentIncomes.map(i => ({ ...i, type: 'INCOME', amount: Number(i.amount) }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

  return {
    totalIncome,
    totalExpense,
    remainingBalance,
    expensesByCategory,
    recentTransactions: allTransactions,
  };
};
