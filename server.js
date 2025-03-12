import connectDB from "./config/db.js";
import express from "express";
import ratingRoutes from "./routes/phoneAdminApi.js"
import specificationRoutes from "./routes/specificationRoutes.js"
import cors from "cors"

const app = express();

connectDB();
app.use(cors())
app.use(express.json());

app.use("/api", ratingRoutes);
app.use("/api/specification",specificationRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
