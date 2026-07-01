import { Request, Response } from "express";
import crypto from "crypto";

import { prisma } from "../db/prisma";
import paystack from "../services/paystack.service";
import { sendCreateTabEvent } from "../kafka/paymentProducer";

export const initializeCardSetup = async (req: Request, res: Response) => {
  try {
    const {
      email,
      amount,
      metadata,
    } = req.body;

    const reference =
      crypto.randomUUID();

    const response =
      await paystack.post(
        "/transaction/initialize",
        {
          email,
          amount: amount * 100,
          reference,
          metadata,
          callback_url:
            `${process.env.FRONTEND_URL}/payment-success`
        }
      );

    res.json(response.data);
  } catch (error: any) {
    res.status(500).json(error.response?.data);
  }
};

export const verifyPayment = async (
  req: Request,
  res: Response
) => {
  try {
    const { reference } = req.params;

    const response = await paystack.get(`/transaction/verify/${reference}`);

    res.json(response.data);
  } catch (error: any) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message:
        error?.response?.data ||
        error.message,
    });
  }
};

export const chargeAuthorization = async (req: Request, res: Response) => {
  try {
    const { authorizationCode, email, amount, metadata } = req.body;

    const response =
      await paystack.post(
        "/transaction/charge_authorization",
        {
          authorization_code: authorizationCode,
          email,
          amount: amount * 100,
          metadata
        }
      );

    res.json(response.data);
  } catch (error: any) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message:
        error?.response?.data ||
        error.message,
    });
  }
};

export const recordPaymentMethod = async (req: Request, res: Response) => {
  try {
    const event = req.body;

    switch (event.event) {
      case "charge.success":
        const data = event.data;

        const paymentMethod = await prisma.paymentMethod.create({
          data: {
            userId: data.metadata.userId,
            customerCode: data.customer.customer_code,
            authorizationCode: data.authorization.authorization_code,
            cardType: data.authorization.card_type,
            last4: data.authorization.last4,
            expMonth: data.authorization.exp_month,
            expYear: data.authorization.exp_year
          }
        });

        if (paymentMethod) {
          await sendCreateTabEvent({
            tabId: data.metadata.tabId,
            userId: data.metadata.userId,
            venueId: data.metadata.venueId,
            paymentMethodId: paymentMethod.id,
            preAuthAmount: Number(data.amount)
          });
        }

        return res.status(200).json({
          success: true,
          message: "Charge Successful",
        });

      case "charge.failed":
        return res.status(400).json({
          success: false,
          message: "Charge Failed",
        });

      default:
        return res.status(400).json({
          success: false,
          message: "Charge Failed",
        });
    }
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getPaymentMethods = async (req: Request, res: Response) => {
  try {
    const paymentMethods = await prisma.paymentMethod.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: paymentMethods,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getPaymentMethod = async (req: Request, res: Response) => {
  try {
    const { paymentMethodId } = req.params;

    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: {
        id: String(paymentMethodId),
      },
    });

    if (!paymentMethod) {
      return res.status(404).json({
        success: false,
        message: "Payment method not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: paymentMethod,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getUserPaymentMethods = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const paymentMethods = await prisma.paymentMethod.findMany({
      where: {
        userId: String(userId),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: paymentMethods,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};