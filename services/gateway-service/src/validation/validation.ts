import { NextFunction, Request, Response } from "express";
import "dotenv/config";
import { calculateAmount } from "../utils/calculateAmount";

const { USER_SERVICE_URL, PAYMENT_SERVICE_URL, TAB_SERVICE_URL } = process.env;

const userIdValidation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.body ?? {};

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required." });
    }

    const response = await fetch(`${USER_SERVICE_URL}/api/users/${userId}`);
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
    const { venueId } = req.body ?? {};

    if (!venueId) {
      return res
        .status(400)
        .json({ success: false, message: "Venue ID is required." });
    }

    const response = await fetch(
      `${USER_SERVICE_URL}/api/venues/${venueId}`,
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

const tabIdValidation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { tabId } = req.body ?? {};

    if (!tabId) {
      return res
        .status(400)
        .json({ success: false, message: "Tab ID is required." });
    }

    const response = await fetch(`${TAB_SERVICE_URL}/api/tabs/${tabId}`);

    if (response.status == 200) {
      return res.status(400).json({
        success: "false",
        message: "Tab already exists"
      });
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
      fetch(`${USER_SERVICE_URL}/api/users/${userId}`),
      fetch(`${USER_SERVICE_URL}/api/venues/${venueId}`),
      fetch(`${PAYMENT_SERVICE_URL}/api/payments/${paymentMethodId}`),
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

const createTabItemValidation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { tabId, unitPrice, quantity } = req.body ?? {};

    if (!tabId) {
      return res
        .status(400)
        .json({ success: false, message: "Tab ID is required." });
    }

    if (!unitPrice || !quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Unit price and quantity are required." });
    }

    const tabResponse = await fetch(`${TAB_SERVICE_URL}/api/tabs/${tabId}`);
    if (tabResponse.status === 404) {
      return res.status(404).json({ success: false, message: "Tab not found." });
    }

    if (tabResponse.status === 200) {
      const tabResponseJson = await tabResponse.json();
      const tab = tabResponseJson.data;
      const newItemPrice = unitPrice * quantity;

      const currentBill = calculateAmount(tab);
      const newBill = calculateAmount({...tab, runningTotal: Number(tab.runningTotal) + newItemPrice });

      if (newBill.totalDue >= tab.preAuthAmount) {
        return res.status(402).json({
          error: "Pre-auth limit exceeded. Authorize additional top-up funds.",
          currentBalance: Number(tab.preAuthAmount) - currentBill.totalDue,
          attemptedCharge: newBill.totalDue - currentBill.totalDue,
        });
      }
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export default { userIdValidation, venueIdValidation, tabIdValidation, createTabValidation, createTabItemValidation };
