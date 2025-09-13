import mongoose from 'mongoose'
import { DB_NAME } from '../constant.js'

// import dotenv from "dotenv"
// dotenv.config()

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error("MonogoDB connection error: ", err.message);
    process.exit(1);
  }
};

export default connectDB
