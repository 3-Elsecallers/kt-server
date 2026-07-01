import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { createTransactionValidation, depositTransactionValidation } from "../validation/transactionValidation";

/**
 * Create Transaction
 */
// export const createTransaction = async (req: Request, res: Response) => {
//   try {
//     const {
//       tabId,
//       idempotencyKey,
//       type,
//       amountPesewas,
//       gratuityPesewas = 0,
//     } = req.body;

//     const { valid, errors } = createTransactionValidation({
//       tabId,
//       idempotencyKey,
//       type,
//       amountPesewas,
//       gratuityPesewas,
//     });

//     if (!valid) {
//       return res.status(400).json({
//         success: false,
//         errors,
//       });
//     }

//     const existingTransaction = await prisma.transaction.findUnique({
//       where: {
//         idempotencyKey,
//       },
//     });

//     if (existingTransaction) {
//       return res.status(200).json({
//         success: true,
//         data: existingTransaction,
//         idempotent: true,
//       });
//     }

//     const transaction = await prisma.transaction.create({
//       data: {
//         userId: "",
//         tabId,
//         paymentMethodId: "",
//         idempotencyKey,
//         type,
//         amountPesewas,
//         gratuityPesewas,
//         status: "PENDING",
//       },
//     });

//     return res.status(201).json({
//       success: true,
//       data: transaction,
//     });
//   } catch (error) {
//     console.error(error);

//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

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
        status: "AUTHORIZED",
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

// const deposit = async (req: Request, res: Response) => {
//   const payload = req.body;

//   const { valid, errors } = depositTransactionValidation(payload);
//   if (!valid) {
//     return res.status(400).json({ errors });
//   }

//   let newTransaction;
//   try {
//     // initiate transfer and set transaction status as PENDING
//     newTransaction = new Transaction({ ...payload, status: "PENDING" });
//     await newTransaction.save();
//     console.log(
//       `Deposit transaction ${newTransaction.id} initiated by ${payload.senderUserId}.`
//     );

//     // initiate payment with external gateway
//     const gatewayResponse = await initiatePayment({
//       transactionId: newTransaction.id,
//       amount: payload.amount,
//       currency: payload.currency,
//       description: `Deposit to wallet ${payload.walletId}`,
//       customerInfo: payload.customerInfo,
//       paymentMethod: payload.paymentMethod,
//     });

//     // update transaction status to PENDING
//     await Transaction.findByIdAndUpdate(
//       newTransaction.id,
//       {
//         status: "PENDING_GATEWAY_CONFIRMATION",
//         gatewayTransactionId: gatewayResponse.gatewayTransactionId,
//       },
//       { new: true, useFindAndModify: false }
//     );

//     // respond to client with gateway redirect URL or status
//     console.log(
//       `Deposit transaction ${newTransaction.id} sent to gateway. Gateway Ref: ${gatewayResponse.gatewayTransactionId}`
//     );
//     return res.status(200).json({
//       message: "Deposit initiated, awaiting payment confirmation.",
//       transactionId: newTransaction.id,
//       status: "PENDING_GATEWAY_CONFIRMATION",
//       gatewayDetails: gatewayResponse,
//     });
//   } catch (error) {
//     console.log(
//       `Error processing deposit for transaction ${newTransaction?.id}: ${error.message}`,
//       { error }
//     );
//     if (newTransaction?.id) {
//       await Transaction.findByIdAndUpdate(
//         newTransaction.id,
//         { status: "FAILED" },
//         { new: true, useFindAndModify: false }
//       );
//     }
//     res
//       .status(500)
//       .json({ message: "Deposit initiation failed", details: error.message });
//   }
// }

// const handleGatewayWebhook = async (req, res) => {
//   const { transactionId, gatewayStatus, gatewayReference, amount, currency } = req.body;
//   // In a real system, you'd verify webhook signature for security
//   // const signature = req.header('X-Gateway-Signature');
//   // if (!verifySignature(signature, req.body, config.paymentGateway.webhookSecret)) {
//   //     return res.status(403).json({ message: 'Invalid webhook signature' });
//   // }

//   try {
//     const transaction = await Transaction.findById(transactionId);
//     if (!transaction) {
//       logger.warn(`Received webhook for unknown transaction ID: ${transactionId}`);
//       return res.status(404).json({ message: 'Transaction not found' });
//     }

//     if (gatewayStatus === 'SUCCESS') {
//       await Transaction.updateStatus(transactionId, 'SUCCESS', gatewayReference);
//       logger.info(`Transaction ${transactionId} confirmed SUCCESS by gateway. Crediting wallet...`);

//       // Credit the wallet (for deposits or incoming payments)
//       // This is a critical step - ensure idempotency if multiple webhooks arrive
//       if (transaction.type === 'Deposit') {
//         await walletApiService.creditWallet(transaction.sender_wallet_id, transaction.amount);
//         logger.info(`Wallet ${transaction.sender_wallet_id} credited for deposit ${transactionId}.`);
//       }
//       // For P2M, it would be credit to merchant's wallet.
//       // For P2P, the credit happens as part of the initial `sendTransactionEvent` by Transaction Service
//       // so we don't double credit here.

//       await sendTransactionEvent({
//         type: 'transaction_completed',
//         status: 'SUCCESS',
//         transactionId: transaction.id,
//         transactionType: transaction.type,
//         senderUserId: transaction.sender_user_id,
//         senderWalletId: transaction.sender_wallet_id,
//         receiverUserId: transaction.receiver_user_id,
//         receiverWalletId: transaction.receiver_wallet_id,
//         amount: transaction.amount,
//         currency: transaction.currency,
//         gatewayTransactionId: gatewayReference,
//       });

//       res.status(200).json({ message: 'Webhook processed, transaction successful.' });

//     } else if (gatewayStatus === 'FAILED' || gatewayStatus === 'CANCELLED') {
//       await Transaction.updateStatus(transactionId, 'FAILED', gatewayReference);
//       logger.info(`Transaction ${transactionId} confirmed FAILED by gateway.`);

//       // If it was a deposit that failed after initial debit (e.g. from a bank transfer where funds are held)
//       // or any other scenario where a debit might need reversal, handle here.
//       // For deposits, if gateway fails, no debit occurred, so no reversal needed typically.

//       await sendTransactionEvent({
//         type: 'transaction_failed',
//         status: 'FAILED',
//         transactionId: transaction.id,
//         transactionType: transaction.type,
//         senderUserId: transaction.sender_user_id,
//         senderWalletId: transaction.sender_wallet_id,
//         receiverUserId: transaction.receiver_user_id,
//         receiverWalletId: transaction.receiver_wallet_id,
//         amount: transaction.amount,
//         currency: transaction.currency,
//         gatewayTransactionId: gatewayReference,
//         reason: gatewayStatus,
//       });

//       res.status(200).json({ message: 'Webhook processed, transaction failed.' });
//     } else {
//       logger.warn(`Unhandled gateway status for transaction ${transactionId}: ${gatewayStatus}`);
//       res.status(200).json({ message: 'Unhandled status received.' });
//     }

//   } catch (err) {
//     logger.error(`Error processing gateway webhook for transaction ${transactionId}: ${err.message}`, { error: err });
//     res.status(500).json({ message: 'Server error processing webhook.' });
//   }
// };
