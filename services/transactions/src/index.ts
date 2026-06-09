import express from "express";
import cors from "cors";
import "dotenv/config";

import transactionRoutes from "./routes/transactions.routes";

const app = express();
const PORT = process.env.PORT || 8084;

app.use(cors());
app.use(express.json());

app.use("/api/transactions", transactionRoutes);

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
