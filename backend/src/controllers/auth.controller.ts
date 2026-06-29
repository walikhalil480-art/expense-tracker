import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import * as authService from '../services/auth.service';
import { requireAuthUser } from '../middleware/auth';
import { catchAsync } from '../utils/catchAsync';
import { config } from '../config';
import type { LoginInput, RegisterInput } from '../validators/auth.validator';

const setTokenCookie = (res: Response, token: string) => {
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
  });
};

export const register = catchAsync<ParamsDictionary, unknown, RegisterInput>(async (req, res) => {
  const { user, token } = await authService.registerUser(req.body);
  setTokenCookie(res, token);
  res.status(201).json({ status: 'success', data: { user, token } });
});

export const login = catchAsync<ParamsDictionary, unknown, LoginInput>(async (req, res) => {
  const { user, token } = await authService.loginUser(req.body);
  setTokenCookie(res, token);
  res.status(200).json({ status: 'success', data: { user, token } });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success', data: null });
});

export const getMe = catchAsync(async (req, res) => {
  const user = requireAuthUser(req);
  res.status(200).json({ status: 'success', data: { user } });
});
