import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './db/db.js';
import authRoutes from './routes/auth.route.js';
import leadRoutes from './routes/leads.route.js';
import dotenv from 'dotenv'

dotenv.config()
connectDB();
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

export default app;
