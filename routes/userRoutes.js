import express from 'express';
import { auth } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { GetMe, GetAllUsers, DeleteUser } from '../controller/UserController.js';

const router = express.Router();

router.get('/me', auth, GetMe);
router.get('/', auth, roleGuard('admin'), GetAllUsers);
router.delete('/:id', auth, roleGuard('admin'), DeleteUser);

export default router;
