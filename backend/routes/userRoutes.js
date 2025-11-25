// USER ROUTES

// User profile routes
import express from 'express';
import multer from 'multer';
import path from 'path';
import {
    deleteAccount,
    getAllUsers,
    getProfile,
    getUserById,
    updateProfile
} from '../controllers/userController.js';
import { authorize, protect } from '../middleware/auth.js';

// Configure multer to store uploads in backend/uploads
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join(process.cwd(), 'backend', 'uploads');
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        }
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype && file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Only image files are allowed'), false);
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});

const router = express.Router();

// Protected routes - all users
router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.delete('/profile', protect, deleteAccount);

// Admin only routes
router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, getUserById);

export default router;