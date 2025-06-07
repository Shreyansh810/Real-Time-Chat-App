import express from 'express';
import { login, logout, signup, updateProfile, checkAuth } from '../controllers/authController.js';
import { protectRoute } from '../middleware/protectRoute.js';

const authRouter = express.Router();

authRouter.post('/sign-up', signup);

authRouter.post('/logout', logout);

authRouter.post('/login', login);

authRouter.put('/update-profile', protectRoute, updateProfile);

authRouter.get('/check', protectRoute, checkAuth);


export default authRouter;