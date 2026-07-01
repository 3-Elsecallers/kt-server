// import { Request, Response } from 'express';
// import crypto from 'crypto';
// import { prisma } from "../db/prisma";
// import paystack from '../services/paystack.service';

// export const preAuthorizeTransaction = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const {
//       userId,
//       paymentMethodId,
//       amount,
//       email,
//       tabId,
//     } = req.body;

//     if (!userId || !paymentMethodId || !amount || !email) {
//       return res.status(400).json({
//         success: false,
//         message: 'Missing required fields',
//       });
//     }

//     // const paymentMethod = await prisma.paymentMethod.findUnique({
//     //   where: {
//     //     id: paymentMethodId,
//     //   },
//     // });

//     // if (!paymentMethod) {
//     //   return res.status(404).json({
//     //     success: false,
//     //     message: 'Payment method not found',
//     //   });
//     // }

//     const idempotencyKey = crypto.randomUUID();

//     const transaction = await prisma.transaction.create({
//       data: {
//         userId,
//         tabId,
//         paymentMethodId,
//         amountPesewas: amount,
//         idempotencyKey,
//         type: "PRE_AUTH",
//         status: 'PENDING',
//       },
//     });

//     const paystackResponse = await paystack.post(
//       '/transaction/charge_authorization',
//       {
//         email,
//         amount: Math.round(amount * 100),
//         authorization_code:
//           "paymentMethod.gatewayPaymentToken",

//         reference: idempotencyKey,

//         capture: false,
//       }
//     );

//     const data = paystackResponse.data.data;

//     await prisma.transaction.update({
//       where: {
//         id: transaction.id,
//       },
//       data: {
//         authorizationCode:
//           data.authorization?.authorization_code,

//         gatewayTransactionId:
//           data.id?.toString(),

//         status:
//           data.status === 'success'
//             ? 'AUTHORIZED'
//             : 'FAILED',
//       },
//     });

//     return res.status(200).json({
//       success: true,
//       transactionReference: idempotencyKey,
//       authorizationCode:
//         data.authorization?.authorization_code,
//       status: data.status,
//     });
//   } catch (error: any) {
//     console.error(error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };