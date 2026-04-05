import express from 'express';
import { auth } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { createTransaction, getTransactions, updateTransaction, deleteTransaction } from '../controller/TransactionController.js';

const router = express.Router();

// Viewers, Analysts, and Admins can view transactions
router.get('/', auth, getTransactions);

// Analysts and Admins can create transactions
router.post('/', auth, roleGuard('admin', 'analyst'), createTransaction);

// Only Admins can modify/delete transactions
router.put('/:id', auth, roleGuard('admin'), updateTransaction);
router.delete('/:id', auth, roleGuard('admin'), deleteTransaction);

export default router;
