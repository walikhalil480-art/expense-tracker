import { ParamsDictionary } from 'express-serve-static-core';
import * as incomeService from '../services/income.service';
import { requireAuthUser } from '../middleware/auth';
import { catchAsync } from '../utils/catchAsync';
import type { IdParams } from '../types/request';
import type {
  CreateIncomeInput,
  IncomeQuery,
  UpdateIncomeInput,
} from '../validators/income.validator';

export const createIncome = catchAsync<ParamsDictionary, unknown, CreateIncomeInput>(
  async (req, res) => {
    const user = requireAuthUser(req);
    const income = await incomeService.createIncome(user.id, req.body);

    res.status(201).json({
      status: 'success',
      data: { income },
    });
  }
);

export const getIncomes = catchAsync<ParamsDictionary, unknown, unknown, IncomeQuery>(
  async (req, res) => {
    const user = requireAuthUser(req);
    const data = await incomeService.getIncomes(user.id, req.query);

    res.status(200).json({
      status: 'success',
      data,
    });
  }
);

export const getIncomeById = catchAsync<IdParams>(async (req, res) => {
  const user = requireAuthUser(req);
  const income = await incomeService.getIncomeById(user.id, req.params.id);

  res.status(200).json({
    status: 'success',
    data: { income },
  });
});

export const updateIncome = catchAsync<IdParams, unknown, UpdateIncomeInput>(
  async (req, res) => {
    const user = requireAuthUser(req);
    const income = await incomeService.updateIncome(user.id, req.params.id, req.body);

    res.status(200).json({
      status: 'success',
      data: { income },
    });
  }
);

export const deleteIncome = catchAsync<IdParams>(async (req, res) => {
  const user = requireAuthUser(req);
  await incomeService.deleteIncome(user.id, req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
