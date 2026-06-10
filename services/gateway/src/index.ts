import express from "express";
import cors from "cors";
import "dotenv/config";

import userRoutes from "./routes/user.routes";
import venueRoutes from "./routes/venue.routes";
import paymentMethodRoutes from "./routes/paymentMethod.routes";

import tabRoutes from "./routes/tab.routes";
import tabItemRoutes from "./routes/tabItem.routes";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// auth_wallet service routes
app.use("/api/users", userRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/paymentMethods", paymentMethodRoutes);

// tab management service routes
app.use("/api/tabs", tabRoutes);
app.use("/api/tabItems", tabItemRoutes);

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
