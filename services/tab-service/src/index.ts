import express from "express";
import cors from "cors";
import "dotenv/config";

import tabRoutes from "./routes/tab.routes";
import tabItemRoutes from "./routes/tabItem.routes";

import { initConsumer } from "./kafka/tabConsumer";

const app = express();
const PORT = process.env.PORT || 8082;

app.use(cors());
app.use(express.json());

app.use("/api/tabs", tabRoutes);
app.use("/api/tab-items", tabItemRoutes);

initConsumer();

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
