import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/appError';

const prisma = new PrismaClient();

interface JwtPayload {
  id: string;
  organizationId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        organizationId: string;
      };
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new AppError('Not authorized to access this route', 401);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      throw new AppError('User no longer exists', 401);
    }

    // Add user info to request
    req.user = {
      id: decoded.id,
      organizationId: decoded.organizationId
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const restrictTo = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id }
      });

      if (!user || !roles.includes(user.role)) {
        throw new AppError('Not authorized to access this route', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};