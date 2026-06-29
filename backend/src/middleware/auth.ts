import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { config } from '../config';
import prisma from '../prisma/client';
import type { AuthUser } from '../types/auth';

const getBearerToken = (authorization: string | undefined): string | undefined => {
  if (!authorization?.startsWith('Bearer ')) {
    return undefined;
  }

  const token = authorization.split(' ')[1];
  return token || undefined;
};

const getCookieToken = (req: Request): string | undefined => {
  const cookieToken = req.cookies?.jwt;
  return typeof cookieToken === 'string' ? cookieToken : undefined;
};

const hasUserId = (decoded: string | JwtPayload): decoded is JwtPayload & { id: string } => {
  return typeof decoded !== 'string' && typeof decoded.id === 'string';
};

export const requireAuthUser = (req: { user?: AuthUser }): AuthUser => {
  if (!req.user) {
    throw new AppError('You are not logged in! Please log in to get access.', 401);
  }

  return req.user;
};

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = getBearerToken(req.headers.authorization) ?? getCookieToken(req);

    if (!token) {
      next(new AppError('You are not logged in! Please log in to get access.', 401));
      return;
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    if (!hasUserId(decoded)) {
      next(new AppError('Invalid token payload', 401));
      return;
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true }
    });

    if (!currentUser) {
      next(new AppError('The user belonging to this token does no longer exist.', 401));
      return;
    }

    req.user = currentUser;
    next();
  } catch (error) {
    next(new AppError('Invalid token or token expired', 401));
  }
};
