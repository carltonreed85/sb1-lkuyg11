import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AppError } from '../utils/appError';

const prisma = new PrismaClient();

// Organization Settings
export const getOrganizationSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const organization = await prisma.organization.findUnique({
      where: { id: req.user!.organizationId }
    });

    if (!organization) {
      throw new AppError('Organization not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: organization
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrganizationSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const organization = await prisma.organization.update({
      where: { id: req.user!.organizationId },
      data: req.body
    });

    res.status(200).json({
      status: 'success',
      data: organization
    });
  } catch (error) {
    next(error);
  }
};

// Locations
export const getLocations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const locations = await prisma.location.findMany({
      where: { organizationId: req.user!.organizationId }
    });

    res.status(200).json({
      status: 'success',
      data: locations
    });
  } catch (error) {
    next(error);
  }
};

export const createLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const location = await prisma.location.create({
      data: {
        ...req.body,
        organizationId: req.user!.organizationId
      }
    });

    res.status(201).json({
      status: 'success',
      data: location
    });
  } catch (error) {
    next(error);
  }
};

export const updateLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const location = await prisma.location.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.user!.organizationId
      }
    });

    if (!location) {
      throw new AppError('Location not found', 404);
    }

    const updatedLocation = await prisma.location.update({
      where: { id: req.params.id },
      data: req.body
    });

    res.status(200).json({
      status: 'success',
      data: updatedLocation
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const location = await prisma.location.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.user!.organizationId
      }
    });

    if (!location) {
      throw new AppError('Location not found', 404);
    }

    await prisma.location.delete({
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

// Providers
export const getProviders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const providers = await prisma.provider.findMany({
      where: { organizationId: req.user!.organizationId }
    });

    res.status(200).json({
      status: 'success',
      data: providers
    });
  } catch (error) {
    next(error);
  }
};

export const createProvider = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const provider = await prisma.provider.create({
      data: {
        ...req.body,
        organizationId: req.user!.organizationId
      }
    });

    res.status(201).json({
      status: 'success',
      data: provider
    });
  } catch (error) {
    next(error);
  }
};

export const updateProvider = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const provider = await prisma.provider.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.user!.organizationId
      }
    });

    if (!provider) {
      throw new AppError('Provider not found', 404);
    }

    const updatedProvider = await prisma.provider.update({
      where: { id: req.params.id },
      data: req.body
    });

    res.status(200).json({
      status: 'success',
      data: updatedProvider
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProvider = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const provider = await prisma.provider.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.user!.organizationId
      }
    });

    if (!provider) {
      throw new AppError('Provider not found', 404);
    }

    await prisma.provider.delete({
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

// Specialties
export const getSpecialties = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const specialties = await prisma.location.findMany({
      where: { organizationId: req.user!.organizationId },
      select: {
        medicalServices: true
      }
    });

    res.status(200).json({
      status: 'success',
      data: specialties
    });
  } catch (error) {
    next(error);
  }
};

export const createSpecialty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const location = await prisma.location.update({
      where: { id: req.body.locationId },
      data: {
        medicalServices: {
          push: req.body.specialty
        }
      }
    });

    res.status(201).json({
      status: 'success',
      data: location
    });
  } catch (error) {
    next(error);
  }
};

export const updateSpecialty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const location = await prisma.location.findFirst({
      where: {
        id: req.body.locationId,
        organizationId: req.user!.organizationId
      }
    });

    if (!location) {
      throw new AppError('Location not found', 404);
    }

    const updatedLocation = await prisma.location.update({
      where: { id: req.body.locationId },
      data: {
        medicalServices: {
          set: location.medicalServices.map(s => 
            s === req.params.id ? req.body.specialty : s
          )
        }
      }
    });

    res.status(200).json({
      status: 'success',
      data: updatedLocation
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSpecialty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const location = await prisma.location.findFirst({
      where: {
        id: req.body.locationId,
        organizationId: req.user!.organizationId
      }
    });

    if (!location) {
      throw new AppError('Location not found', 404);
    }

    const updatedLocation = await prisma.location.update({
      where: { id: req.body.locationId },
      data: {
        medicalServices: {
          set: location.medicalServices.filter(s => s !== req.params.id)
        }
      }
    });

    res.status(200).json({
      status: 'success',
      data: updatedLocation
    });
  } catch (error) {
    next(error);
  }
};