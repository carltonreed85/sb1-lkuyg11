import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { AppError } from '../utils/appError';

const prisma = new PrismaClient();

// Validation schemas
const registerSchema = z.object({
  organizationName: z.string().min(2),
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Helper function to create JWT
const createToken = (id: string, organizationId: string): string => {
  return jwt.sign(
    { id, organizationId },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Register new user and organization
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate request body
    const { organizationName, name, email, password } = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new AppError('User already exists', 400);
    }

    // Create organization
    const organization = await prisma.organization.create({
      data: {
        name: organizationName,
        address: '',
        phone: '',
        email: '',
      }
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'ADMIN',
        organizationId: organization.id,
      }
    });

    // Create token
    const token = createToken(user.id, organization.id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        organization: {
          id: organization.id,
          name: organization.name,
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login user
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate request body
    const { email, password } = loginSchema.parse(req.body);

    // Get user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        organization: true
      }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError('Invalid email or password', 401);
    }

    // Create token
    const token = createToken(user.id, user.organizationId);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        organization: {
          id: user.organization.id,
          name: user.organization.name,
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Forgot password
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new AppError('No user found with this email address', 404);
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    // In a real application, send email with reset link
    // For demo, just return the token
    res.status(200).json({
      status: 'success',
      message: 'Reset token sent to email',
      resetToken // Remove this in production
    });
  } catch (error) {
    next(error);
  }
};

// Reset password
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password
    const user = await prisma.user.update({
      where: { id: decoded.id },
      data: { password: hashedPassword }
    });

    res.status(200).json({
      status: 'success',
      message: 'Password reset successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Update password (for logged in users)
export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id }
    });

    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      throw new AppError('Current password is incorrect', 401);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};