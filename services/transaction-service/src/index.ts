import express from "express";
import cors from "cors";
import "dotenv/config";

import transactionRoutes from "./routes/transactions.routes";
import paymentRoutes from "./routes/payment.routes";

const app = express();
const PORT = process.env.PORT || 8084;

app.use(cors());
app.use(express.json());

app.use("/api/transactions", transactionRoutes);
app.use("/api/payments", paymentRoutes);

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
