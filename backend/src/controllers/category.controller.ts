import { ParamsDictionary } from 'express-serve-static-core';
import * as categoryService from '../services/category.service';
import { requireAuthUser } from '../middleware/auth';
import { catchAsync } from '../utils/catchAsync';
import type { IdParams } from '../types/request';
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../validators/category.validator';

export const createCategory = catchAsync<ParamsDictionary, unknown, CreateCategoryInput>(
  async (req, res) => {
    const user = requireAuthUser(req);
    const category = await categoryService.createCategory(user.id, req.body);

    res.status(201).json({
      status: 'success',
      data: { category },
    });
  }
);

export const getCategories = catchAsync(async (req, res) => {
  const user = requireAuthUser(req);
  const categories = await categoryService.getCategories(user.id);

  res.status(200).json({
    status: 'success',
    data: { categories },
  });
});

export const updateCategory = catchAsync<IdParams, unknown, UpdateCategoryInput>(
  async (req, res) => {
    const user = requireAuthUser(req);
    const category = await categoryService.updateCategory(user.id, req.params.id, req.body);

    res.status(200).json({
      status: 'success',
      data: { category },
    });
  }
);

export const deleteCategory = catchAsync<IdParams>(async (req, res) => {
  const user = requireAuthUser(req);
  await categoryService.deleteCategory(user.id, req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
