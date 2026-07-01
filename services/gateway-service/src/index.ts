import express from "express";
import cors from "cors";
import "dotenv/config";

import userRoutes from "./routes/user.routes";
import venueRoutes from "./routes/venue.routes";
import paymentMethodRoutes from "./routes/paymentMethod.routes";
import webhookRoutes from "./routes/webhook.routes";

import tabRoutes from "./routes/tab.routes";
import tabItemRoutes from "./routes/tabItem.routes";

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(
  "/webhooks/paystack",
  express.raw({
    type: "application/json",
  })
);
app.use(express.json());

// user service routes
app.use("/api/users", userRoutes);
app.use("/api/venues", venueRoutes);

// payment service routes
app.use("/api/payments", paymentMethodRoutes);

// tab service routes
app.use("/api/tabs", tabRoutes);
app.use("/api/tab-items", tabItemRoutes);

// paystack webhook routes
app.use("/webhooks", webhookRoutes);

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
