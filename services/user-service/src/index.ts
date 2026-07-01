import express from "express";
import cors from "cors";
import "dotenv/config";

import userRoutes from "./routes/user.routes";
import venueRoutes from "./routes/venue.routes";

const app = express();
const PORT = process.env.PORT || 8081;

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/venues", venueRoutes);

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
