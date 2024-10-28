import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AppError } from '../utils/appError';

const prisma = new PrismaClient();

// Validation schemas
const patientSchema = z.object({
  fullName: z.string().min(2),
  dateOfBirth: z.string().datetime(),
  gender: z.string(),
  ethnicity: z.string().optional(),
  contactInfo: z.object({
    phone: z.string(),
    address: z.string()
  }),
  insurance: z.object({
    primary: z.object({
      provider: z.string(),
      policyNumber: z.string(),
      groupNumber: z.string(),
      effectiveDate: z.string(),
      policyHolder: z.object({
        name: z.string(),
        relationship: z.string(),
        dateOfBirth: z.string()
      })
    }),
    secondary: z.object({
      provider: z.string(),
      policyNumber: z.string(),
      groupNumber: z.string(),
      effectiveDate: z.string(),
      policyHolder: z.object({
        name: z.string(),
        relationship: z.string(),
        dateOfBirth: z.string()
      })
    }).optional()
  }),
  emergencyContact: z.object({
    name: z.string(),
    relationship: z.string(),
    phone: z.string()
  }),
  medicalHistory: z.object({
    conditions: z.array(z.string()),
    allergies: z.array(z.string()),
    medications: z.array(z.string())
  })
});

// Get all patients for organization
export const getPatients = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const patients = await prisma.patient.findMany({
      where: {
        organizationId: req.user!.organizationId
      }
    });

    res.status(200).json({
      status: 'success',
      data: patients
    });
  } catch (error) {
    next(error);
  }
};

// Get single patient
export const getPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const patient = await prisma.patient.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.user!.organizationId
      }
    });

    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

// Create patient
export const createPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = patientSchema.parse(req.body);

    const patient = await prisma.patient.create({
      data: {
        ...validatedData,
        organizationId: req.user!.organizationId
      }
    });

    res.status(201).json({
      status: 'success',
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

// Update patient
export const updatePatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const patient = await prisma.patient.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.user!.organizationId
      }
    });

    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    const updatedPatient = await prisma.patient.update({
      where: { id: req.params.id },
      data: req.body
    });

    res.status(200).json({
      status: 'success',
      data: updatedPatient
    });
  } catch (error) {
    next(error);
  }
};

// Delete patient
export const deletePatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const patient = await prisma.patient.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.user!.organizationId
      }
    });

    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    await prisma.patient.delete({
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