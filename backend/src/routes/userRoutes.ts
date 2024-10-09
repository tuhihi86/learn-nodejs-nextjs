import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { getUserProfile, loginUser, registerUser } from '../controllers/userController';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/profile', authMiddleware, getUserProfile);

export default router;
