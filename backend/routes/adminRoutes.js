// ADMIN ROUTES

import express from 'express';
import {
    deleteUser,
    getActivityLogs,
    getAdminDashboardStats,
    getAllUsers,
    getUserDetails,
    updateUser,
} from '../controllers/adminController.js';
import {
    bulkDeleteQuestions,
    bulkImportQuestions,
    bulkUpdateQuestions,
    createQuestionAdmin,
    deleteQuestionAdmin,
    exportQuestions,
    getAllQuestionsAdmin,
    getQuestionByIdAdmin,
    getQuestionStatistics,
    toggleQuestionActive,
    updateQuestionAdmin,
} from '../controllers/adminQuestionController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(admin);

// Dashboard
router.get('/dashboard-stats', getAdminDashboardStats);
router.get('/activity-logs', getActivityLogs);

// User Management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetails);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Question Management
router.get('/questions/statistics', getQuestionStatistics);
router.get('/questions/export', exportQuestions);
router.post('/questions/bulk-import', bulkImportQuestions);
router.patch('/questions/bulk-update', bulkUpdateQuestions);
router.post('/questions/bulk-delete', bulkDeleteQuestions);

router.get('/questions', getAllQuestionsAdmin);
router.post('/questions', createQuestionAdmin);
router.get('/questions/:id', getQuestionByIdAdmin);
router.put('/questions/:id', updateQuestionAdmin);
router.delete('/questions/:id', deleteQuestionAdmin);
router.patch('/questions/:id/toggle-active', toggleQuestionActive);

export default router;