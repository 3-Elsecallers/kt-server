import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import {
  createVenueValidation,
  updateVenueValidation,
} from "../validation/venueValidation";

/**
 * Create Venue
 */
export const createVenue = async (req: Request, res: Response) => {
  try {
    const { name, address, city, country } = req.body;

    const { valid, errors } = createVenueValidation({
      name,
      address,
      city,
      country,
    });

    if (!valid) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const venue = await prisma.venue.create({
      data: {
        name,
        address,
        city,
        country,
      },
    });

    return res.status(201).json({
      success: true,
      data: venue,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Get All Venues
 */
export const getVenues = async (req: Request, res: Response) => {
  try {
    const venues = await prisma.venue.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: venues,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Get Venue By ID
 */
export const getVenue = async (req: Request, res: Response) => {
  try {
    const { venueId } = req.params;

    const venue = await prisma.venue.findUnique({
      where: {
        id: String(venueId),
      },
    });

    if (!venue) {
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: venue,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Update Venue
 */
export const updateVenue = async (req: Request, res: Response) => {
  try {
    const { venueId } = req.params;
    const { name, address, city, country } = req.body;

    const { valid, errors } = updateVenueValidation({
      name,
      address,
      city,
      country,
    });

    if (!valid) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const existingVenue = await prisma.venue.findUnique({
      where: {
        id: String(venueId),
      },
    });

    if (!existingVenue) {
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });
    }

    const updatedVenue = await prisma.venue.update({
      where: {
        id: String(venueId),
      },
      data: {
        name: name ?? existingVenue.name,
        address: address ?? existingVenue.address,
        city: city ?? existingVenue.city,
        country: country ?? existingVenue.country,
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedVenue,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Delete Venue
 */
export const deleteVenue = async (req: Request, res: Response) => {
  try {
    const { venueId } = req.params;

    const existingVenue = await prisma.venue.findUnique({
      where: {
        id: String(venueId),
      },
    });

    if (!existingVenue) {
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });
    }

    await prisma.venue.delete({
      where: {
        id: String(venueId),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Venue deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
