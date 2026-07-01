import { Request, Response } from "express";
import crypto from "crypto";

import {
  initializeTransaction,
  verifyTransaction,
} from "../services/paystack.service";

export const initializePayment = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, amount } = req.body;

    const reference =
      crypto.randomUUID();

    const payment =
      await initializeTransaction(
        email,
        amount * 100,
        reference
      );

    return res.status(200).json({
      success: true,
      data: payment.data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message:
        error?.response?.data ||
        error.message,
    });
  }
};

export const verifyPayment = async (
  req: Request,
  res: Response
) => {
  try {
    const { reference } = req.params;

    const payment =
      await verifyTransaction(String(reference));

    return res.status(200).json({
      success: true,
      data: payment.data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message:
        error?.response?.data ||
        error.message,
    });
  }
};