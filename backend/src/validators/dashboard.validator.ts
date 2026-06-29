import { z } from 'zod';
import { dateStringSchema } from './common.validator';

const dashboardSummaryQuerySchema = z.object({
  startDate: dateStringSchema.optional(),
  endDate: dateStringSchema.optional(),
});

export const getDashboardSummarySchema = z.object({
  query: dashboardSummaryQuerySchema,
});

export type DashboardSummaryQuery = z.infer<typeof dashboardSummaryQuerySchema>;
