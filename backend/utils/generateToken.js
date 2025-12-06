// GENERATE TOKEN UTILITIES

import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

// Load environment variables from .env file
dotenv.config();

// Generate JWT token for authenticated user
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, 
    process.env.JWT_SECRET, 
    {
      expiresIn: '30d', // Token valid for 30 days
    }
  );
};

export default generateToken;