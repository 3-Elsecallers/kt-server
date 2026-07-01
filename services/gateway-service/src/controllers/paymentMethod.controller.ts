import { Request, Response } from "express";
import "dotenv/config";
import { calculateAmount } from "../utils/calculateAmount";

const { PAYMENT_SERVICE_URL, USER_SERVICE_URL, TAB_SERVICE_URL } = process.env;

const initializePayment = async (req: Request, res: Response) => {
  try {
    const payload = req.body ?? {};

    const response = await fetch(
      `${PAYMENT_SERVICE_URL}/api/payments/initialize`,
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

const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { reference } = req.params;

    const response = await fetch(`${PAYMENT_SERVICE_URL}/api/payments/verify/${reference}`);

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

const chargeAuthorization = async (req: Request, res: Response) => {
  try {
    const { tabId } = req.body ?? {};

    // get tab
    const tabResponse = await fetch(`${TAB_SERVICE_URL}/api/tabs/${tabId}`);
    if (tabResponse.status !== 200) {
      return res.status(404).json({ success: false, message: "Tab not found" })
    }
    const tabJsonResponse = await tabResponse.json();
    const tab = tabJsonResponse.data;

    // get user
    const userResponse = await fetch(`${USER_SERVICE_URL}/api/users/${tab.userId}`);
    const userJsonResponse = await userResponse.json();
    const user = userJsonResponse.data;

    // get payment method
    const paymentMethodResponse = await fetch(`${PAYMENT_SERVICE_URL}/api/payments/${tab.paymentMethodId}`);
    const paymentMethodJsonResponse = await paymentMethodResponse.json();
    const paymentMethod = paymentMethodJsonResponse.data;

    // calculate amount
    const amount = calculateAmount(tab);

    const response = await fetch(
      `${PAYMENT_SERVICE_URL}/api/payments/charge-authorization`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authorizationCode: paymentMethod.authorizationCode,
          email: user.email,
          amount
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
    const response = await fetch(`${PAYMENT_SERVICE_URL}/api/payments`);

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
      `${PAYMENT_SERVICE_URL}/api/payments/${paymentMethodId}`,
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
      `${PAYMENT_SERVICE_URL}/api/payments/user/${userId}`,
    );
    const jsonResponse = await response.json();

    return res.status(response.status).json(jsonResponse);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export default {
  initializePayment,
  getAllPaymentMethods,
  getPaymentMethodById,
  getUserPaymentMethods,
  verifyPayment,
  chargeAuthorization,
};
