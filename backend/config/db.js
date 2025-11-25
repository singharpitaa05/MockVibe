// DATABASE CONNECTION SETUP

import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables 
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MockVibe DataBase Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;