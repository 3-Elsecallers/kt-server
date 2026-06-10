import { Request, Response } from "express";
import "dotenv/config";

const { AUTH_WALLET_BASE_URL } = process.env;

const createVenue = async (req: Request, res: Response) => {
  try {
    const payload = req.body ?? {};

    const response = await fetch(`${AUTH_WALLET_BASE_URL}/api/venues`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
      }),
    });
    const jsonResponse = await response.json();

    return res.status(response.status).json(jsonResponse);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

const getAllVenues = async (req: Request, res: Response) => {
  try {
    const response = await fetch(`${AUTH_WALLET_BASE_URL}/api/venues`);

    if (response.status !== 200) {
      return res.sendStatus(response.status);
    }

    const jsonResponse = await response.json();

    return res.status(response.status).send(jsonResponse);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

const getVenueById = async (req: Request, res: Response) => {
  try {
    const { venueId } = req.params;

    const response = await fetch(`${AUTH_WALLET_BASE_URL}/api/venues/${venueId}`);
    const jsonResponse = await response.json();

    return res.status(response.status).json(jsonResponse);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

const updateVenue = async (req: Request, res: Response) => {
  try {
    const { venueId } = req.params;
    const payload = req.body;

    const response = await fetch(
      `${AUTH_WALLET_BASE_URL}/api/categories/${venueId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...payload }),
      },
    );
    const jsonResponse = await response.json();

    return res.status(response.status).json(jsonResponse);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

const deleteVenue = async (req: Request, res: Response) => {
  try {
    const { venueId } = req.params;

    const response = await fetch(
      `${AUTH_WALLET_BASE_URL}/api/categories/${venueId}`,
      {
        method: "DELETE",
      },
    );
    const jsonResponse = await response.json();

    return res.status(response.status).json(jsonResponse);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export default {
  createVenue,
  getAllVenues,
  getVenueById,
  updateVenue,
  deleteVenue,
};
