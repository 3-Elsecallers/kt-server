import express from "express";
import cors from "cors";
import "dotenv/config";

import paymentMethodRoutes from "./routes/paymentMethod.routes";

import { connectProducer } from "./kafka/paymentProducer";

const app = express();
const PORT = process.env.PORT || 8083;

app.use(cors());
app.use(express.json());

app.use("/api/payments", paymentMethodRoutes);

connectProducer();

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
