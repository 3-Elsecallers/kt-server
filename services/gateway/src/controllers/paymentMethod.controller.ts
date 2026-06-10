import { Request, Response } from "express";
import "dotenv/config";

const { AUTH_WALLET_BASE_URL } = process.env;

const createPaymentMethod = async (req: Request, res: Response) => {
  try {
    const payload = req.body ?? {};

    const response = await fetch(
      `${AUTH_WALLET_BASE_URL}/api/payment-methods`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
        }),
      },
    );
    const jsonResponse = await response.json();

    return res.status(response.status).json(jsonResponse);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

const getAllPaymentMethods = async (req: Request, res: Response) => {
  try {
    const response = await fetch(`${AUTH_WALLET_BASE_URL}/api/payment-methods`);

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

const getPaymentMethodById = async (req: Request, res: Response) => {
  try {
    const { paymentMethodId } = req.params;

    const response = await fetch(
      `${AUTH_WALLET_BASE_URL}/api/payment-methods/${paymentMethodId}`,
    );
    const jsonResponse = await response.json();

    return res.status(response.status).json(jsonResponse);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

const getUserPaymentMethods = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const response = await fetch(
      `${AUTH_WALLET_BASE_URL}/api/payment-methods/user/${userId}`,
    );
    const jsonResponse = await response.json();

    return res.status(response.status).json(jsonResponse);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export default {
  createPaymentMethod,
  getAllPaymentMethods,
  getPaymentMethodById,
  getUserPaymentMethods,
};
