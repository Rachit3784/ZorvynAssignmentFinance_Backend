import express from 'express';
import { Signup, Login, ForgetPassword, ResetPassword } from '../controller/UserController.js';

const router = express.Router();

router.post('/signup', Signup);
router.post('/login', Login);
router.post('/forget-password', ForgetPassword);
router.post('/reset-password', ResetPassword);

export default router;
