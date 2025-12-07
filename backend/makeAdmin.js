// MAKE ADMIN

import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';

dotenv.config();
connectDB();

const email = process.argv[2];

const makeAdmin = async () => {
  const user = await User.findOne({ email });
  if (user) {
    user.role = 'admin';
    await user.save();
    console.log(`${email} is now an admin`);
  } else {
    console.log('User not found');
  }
  process.exit(0);
};

makeAdmin();