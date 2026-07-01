import { Request, Response } from "express";
import crypto from "crypto";
import "dotenv/config";

const { PAYMENT_SERVICE_URL } = process.env;

export const paystackWebhook = async (req: Request, res: Response) => {
  try {
    const hash =
      crypto
        .createHmac(
          "sha512",
          process.env.PAYSTACK_SECRET_KEY!
        )
        .update(req.body)
        .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      return res.sendStatus(401);
    }

    const payload = req.body ?? {};
    const parsedPayload = JSON.parse(payload.toString());

    console.log({ payloadFromPaystack: parsedPayload })
    console.log({ metadata: parsedPayload.data.metadata })

    if (parsedPayload.data.metadata && parsedPayload.data.metadata.action === "PRE_AUTH") {
      const response = await fetch(
        `${PAYMENT_SERVICE_URL}/api/payments/record-payment-method`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parsedPayload),
        },
      );

      const jsonResponse = await response.json();

      return res.status(response.status).json(jsonResponse);
    }

    console.log({ payloadFromPaystack: parsedPayload });
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};