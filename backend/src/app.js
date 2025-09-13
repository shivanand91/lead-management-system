import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import leadRoutes from "./routes/leads.route.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(
    {
        origin: "https://lead-management-system-y55j.vercel.app",
        credentials: true,
    }
));

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

export default app;
