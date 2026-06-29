import type { ParamsDictionary } from 'express-serve-static-core';

export interface IdParams extends ParamsDictionary {
  id: string;
}

export interface DateRangeQuery {
  startDate?: string;
  endDate?: string;
}
