import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { createTransactionValidation } from "../validation/transactionValidation";

/**
 * Create Transaction
 */
export const createTransaction = async (req: Request, res: Response) => {
  try {
    const {
      tabId,
      idempotencyKey,
      type,
      amountPesewas,
      gratuityPesewas = 0,
    } = req.body;

    const { valid, errors } = createTransactionValidation({
      tabId,
      idempotencyKey,
      type,
      amountPesewas,
      gratuityPesewas,
    });

    if (!valid) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const existingTransaction = await prisma.transaction.findUnique({
      where: {
        idempotencyKey,
      },
    });

    if (existingTransaction) {
      return res.status(200).json({
        success: true,
        data: existingTransaction,
        idempotent: true,
      });
    }

    const transaction = await prisma.transaction.create({
      data: {
        tabId,
        idempotencyKey,
        type,
        amountPesewas,
        gratuityPesewas,
        status: "PENDING",
      },
    });

    return res.status(201).json({
      success: true,
      data: transaction,
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
 * Mark Transaction Successful
 */
export const markTransactionSuccessful = async (
  req: Request,
  res: Response,
) => {
  try {
    const { transactionId } = req.params;
    const { gatewayTransactionId } = req.body;

    const transaction = await prisma.transaction.findUnique({
      where: {
        id: String(transactionId),
      },
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    const updatedTransaction = await prisma.transaction.update({
      where: {
        id: String(transactionId),
      },
      data: {
        status: "SUCCESS",
        gatewayTransactionId,
        errorMessage: null,
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedTransaction,
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
 * Mark Transaction Failed
 */
export const markTransactionFailed = async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;
    const { errorMessage } = req.body;

    const transaction = await prisma.transaction.findUnique({
      where: {
        id: String(transactionId),
      },
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    const updatedTransaction = await prisma.transaction.update({
      where: {
        id: String(transactionId),
      },
      data: {
        status: "FAILED",
        errorMessage,
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedTransaction,
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
 * Get Transactions By Tab
 */
export const getTransactionsByTab = async (req: Request, res: Response) => {
  try {
    const { tabId } = req.params;

    const transactions = await prisma.transaction.findMany({
      where: {
        tabId: String(tabId),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
