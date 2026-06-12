import { Request, Response } from "express";
import crypto from "crypto";

const CLIQ_WEBHOOK_SECRET = process.env.CLIQ_WEBHOOK_SECRET;

interface IInitializeTabDetails {
  customerId: string;
  tabId: string;
  customerName: string;
  customerPhoneNumber: string;
  preAuthAmount: number;
}

// Function to open a tab/order inside CliqPOS
const initializeBarTab = async (details: IInitializeTabDetails) => {
  const cliqApiUrl = "https://api.cliqpos.com/v1/orders"; // Replace with actual CliqPOS sandbox/production URL
  const bearerToken = process.env.CLIQ_BEARER_TOKEN;

  // Transform your custom JSON to fit CliqPOS expected schema
  const cliqPayload = {
    tab_name: details.customerName,
    status: "OPEN",
    opened_at: new Date().toISOString(),
    metadata: {
      tab_id: details.tabId, // Storing your reference ID
      customer_phone_number: details.customerPhoneNumber,
      pre_auth_amount: details.preAuthAmount,
    },
  };

  try {
    const response = await fetch(cliqApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify({
        ...cliqPayload,
      }),
    });
    const jsonResponse = await response.json();

    // This returns the CliqPOS generated unique order_id/tab_id
    return jsonResponse.data.order_id;
  } catch (error) {
    console.error("Failed to initialize tab in CliqPOS:", error);
    throw error;
  }
};

// app.post("/webhooks/cliqpos", );

const cliqposWebhook = (req: Request, res: Response) => {
  // 1. Validate that the event actually came from CliqPOS
  const cliqSignature = req.headers["x-cliq-signature"];
  const computedSignature = crypto
    .createHmac("sha256", CLIQ_WEBHOOK_SECRET!)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (cliqSignature !== computedSignature) {
    return res.status(401).send("Unauthorized Signature");
  }

  const { event_type, order_id, data } = req.body;

  // 2. Route actions based on the event type
  switch (event_type) {
    case "order.item_added":
      console.log(
        `Tab ${order_id}: Added ${data.item_name} (Qty: ${data.quantity})`,
      );
      // Update your database or loyalty points tracking
      break;

    case "order.item_removed":
      console.log(`Tab ${order_id}: Removed ${data.item_name}`);
      // Recalculate metrics
      break;

    case "order.closed":
      console.log(
        `Tab ${order_id} has been fully closed out via ${data.payment_method}.`,
      );
      // data.payment_method could be "CASH", "CARD", or "MOBILE_MONEY" (MTN/Vodafone)
      break;

    default:
      console.log(`Unhandled CliqPOS event: ${event_type}`);
  }

  // 3. Always return a 200 OK immediately so CliqPOS doesn't retry the webhook
  res.status(200).send("Event successfully received");
};

export { initializeBarTab, cliqposWebhook };
