import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { createPaymentMethodValidation } from "../validation/paymentMethodValidation";

/**
 * Create Payment Method
 */
export const createPaymentMethod = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      gatewayCustomerToken,
      gatewayPaymentToken,
      providerType,
      maskedIdentifier,
    } = req.body;

    const { valid, errors } = createPaymentMethodValidation({
      userId,
      gatewayCustomerToken,
      gatewayPaymentToken,
      providerType,
      maskedIdentifier,
    });

    if (!valid) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: String(userId),
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        userId,
        gatewayCustomerToken,
        gatewayPaymentToken,
        providerType,
        maskedIdentifier,
      },
    });

    return res.status(201).json({
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

/**
 * Get All Payment Methods
 */
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

/**
 * Get Payment Method By ID
 */
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

/**
 * Get Payment Methods By User
 */
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
