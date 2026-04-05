import express from 'express';
import { auth } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { getSummary, getCategoryBreakdown, getMonthlyTrend, getRecentTransactions } from '../controller/DashboardController.js';

const router = express.Router();

// Only Analysts and Admins get full dash access? No, Viewers also need dashboard data.
router.get('/summary', auth, getSummary);
router.get('/categories', auth, getCategoryBreakdown);
router.get('/monthly-trend', auth, getMonthlyTrend);
router.get('/recent', auth, getRecentTransactions);

export default router;
