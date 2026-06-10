import { NextFunction, Request, Response } from "express";
import "dotenv/config";

const { AUTH_WALLET_BASE_URL } = process.env;

const userIdValidation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required." });
    }

    const response = await fetch(`${AUTH_WALLET_BASE_URL}/api/users/${userId}`);
    const jsonResponse = await response.json();

    if (response.status !== 200) {
      return res.status(response.status).json(jsonResponse);
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

const venueIdValidation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { venueId } = req.body;

    if (!venueId) {
      return res
        .status(400)
        .json({ success: false, message: "Venue ID is required." });
    }

    const response = await fetch(
      `${AUTH_WALLET_BASE_URL}/api/venues/${venueId}`,
    );
    const jsonResponse = await response.json();

    if (response.status !== 200) {
      return res.status(response.status).json(jsonResponse);
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

const createTabValidation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId, venueId, paymentMethodId } = req.body;

    const errors: Record<string, string> = {};
    if (!userId || userId.trim() === "") {
      errors.userId = "User ID is required";
    }
    if (!venueId || venueId.trim() === "") {
      errors.venueId = "Venue ID is required";
    }
    if (!paymentMethodId || paymentMethodId.trim() === "") {
      errors.paymentMethodId = "Payment Method ID is required";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const responses = await Promise.all([
      fetch(`${AUTH_WALLET_BASE_URL}/api/users/${userId}`),
      fetch(`${AUTH_WALLET_BASE_URL}/api/venues/${venueId}`),
      fetch(`${AUTH_WALLET_BASE_URL}/api/payment-methods/${paymentMethodId}`),
    ]);

    const [userRes, venueRes, paymentMethodRes] = await Promise.all(
      responses.map((response) => {
        if (![200, 404].includes(response.status)) {
          return res.sendStatus(response.status);
        }
        return response.json();
      }),
    );

    if (userRes.status !== 200) {
      return res.status(404).json(userRes);
    }

    if (venueRes.status !== 200) {
      return res.status(404).json(venueRes);
    }

    if (paymentMethodRes.status !== 200) {
      return res.status(404).json(paymentMethodRes);
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export default { userIdValidation, venueIdValidation, createTabValidation };
