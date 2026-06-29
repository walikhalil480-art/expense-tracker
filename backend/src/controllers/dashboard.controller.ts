import { ParamsDictionary } from 'express-serve-static-core';
import * as dashboardService from '../services/dashboard.service';
import { requireAuthUser } from '../middleware/auth';
import { catchAsync } from '../utils/catchAsync';
import type { DashboardSummaryQuery } from '../validators/dashboard.validator';

export const getDashboardSummary = catchAsync<
  ParamsDictionary,
  unknown,
  unknown,
  DashboardSummaryQuery
>(async (req, res) => {
  const user = requireAuthUser(req);
  const summary = await dashboardService.getDashboardSummary(user.id, req.query);
  res.status(200).json({ status: 'success', data: summary });
});
