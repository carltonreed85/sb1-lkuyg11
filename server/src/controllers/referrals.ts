import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AppError } from '../utils/appError';

const prisma = new PrismaClient();

// Validation schemas
const referralSchema = z.object({
  patientId: z.string(),
  status: z.string(),
  priority: z.string(),
  details: z.object({
    location: z.string(),
    provider: z.string(),
    medicalService: z.string(),
    reason: z.string(),
    notes: z.string().optional(),
    subStatus: z.string(),
    preferredDate: z.string().optional(),
    preferredTime: z.string().optional(),
    insuranceVerified: z.boolean(),
    insuranceNotes: z.string().optional()
  }),
  documents: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    url: z.string()
  }))
});

// Get all referrals for organization
export const getReferrals = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const referrals = await prisma.referral.findMany({
      where: {
        organizationId: req.user!.organizationId
      },
      include: {
        patient: true
      }
    });

    res.status(200).json({
      status: 'success',
      data: referrals
    });
  } catch (error) {
    next(error);
  }
};

// Get single referral
export const getReferral = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const referral = await prisma.referral.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.user!.organizationId
      },
      include: {
        patient: true
      }
    });

    if (!referral) {
      throw new AppError('Referral not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: referral
    });
  } catch (error) {
    next(error);
  }
};

// Create referral
export const createReferral = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = referralSchema.parse(req.body);

    // Generate case ID
    const caseId = `REF${Math.floor(100000 + Math.random() * 900000)}`;

    const referral = await prisma.referral.create({
      data: {
        ...validatedData,
        caseId,
        organizationId: req.user!.organizationId
      },
      include: {
        patient: true
      }
    });

    res.status(201).json({
      status: 'success',
      data: referral
    });
  } catch (error) {
    next(error);
  }
};

// Update referral
export const updateReferral = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const referral = await prisma.referral.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.user!.organizationId
      }
    });

    if (!referral) {
      throw new AppError('Referral not found', 404);
    }

    const updatedReferral = await prisma.referral.update({
      where: { id: req.params.id },
      data: req.body,
      include: {
        patient: true
      }
    });

    res.status(200).json({
      status: 'success',
      data: updatedReferral
    });
  } catch (error) {
    next(error);
  }
};

// Delete referral
export const deleteReferral = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const referral = await prisma.referral.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.user!.organizationId
      }
    });

    if (!referral) {
      throw new AppError('Referral not found', 404);
    }

    await prisma.referral.delete({
      where: { id: req.params.id }
    });

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

// Get referrals by patient
export const getReferralsByPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const referrals = await prisma.referral.findMany({
      where: {
        patientId: req.params.patientId,
        organizationId: req.user!.organizationId
      },
      include: {
        patient: true
      }
    });

    res.status(200).json({
      status: 'success',
      data: referrals
    });
  } catch (error) {
    next(error);
  }
};