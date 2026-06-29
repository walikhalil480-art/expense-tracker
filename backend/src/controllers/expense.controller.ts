import { ParamsDictionary } from 'express-serve-static-core';
import * as expenseService from '../services/expense.service';
import { requireAuthUser } from '../middleware/auth';
import { catchAsync } from '../utils/catchAsync';
import type { IdParams } from '../types/request';
import type {
  CreateExpenseInput,
  ExpenseQuery,
  UpdateExpenseInput,
} from '../validators/expense.validator';

export const createExpense = catchAsync<ParamsDictionary, unknown, CreateExpenseInput>(
  async (req, res) => {
    const user = requireAuthUser(req);
    const expense = await expenseService.createExpense(user.id, req.body);

    res.status(201).json({
      status: 'success',
      data: { expense },
    });
  }
);

export const getExpenses = catchAsync<ParamsDictionary, unknown, unknown, ExpenseQuery>(
  async (req, res) => {
    const user = requireAuthUser(req);
    const data = await expenseService.getExpenses(user.id, req.query);

    res.status(200).json({
      status: 'success',
      data,
    });
  }
);

export const getExpenseById = catchAsync<IdParams>(async (req, res) => {
  const user = requireAuthUser(req);
  const expense = await expenseService.getExpenseById(user.id, req.params.id);

  res.status(200).json({
    status: 'success',
    data: { expense },
  });
});

export const updateExpense = catchAsync<IdParams, unknown, UpdateExpenseInput>(
  async (req, res) => {
    const user = requireAuthUser(req);
    const expense = await expenseService.updateExpense(user.id, req.params.id, req.body);

    res.status(200).json({
      status: 'success',
      data: { expense },
    });
  }
);

export const deleteExpense = catchAsync<IdParams>(async (req, res) => {
  const user = requireAuthUser(req);
  await expenseService.deleteExpense(user.id, req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
