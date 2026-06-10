import express from "express";
import cors from "cors";
import "dotenv/config";

import userRoutes from "./routes/user.routes";
import venueRoutes from "./routes/venue.routes";
import paymentMethodRoutes from "./routes/paymentMethod.routes";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/paymentMethods", paymentMethodRoutes);

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
