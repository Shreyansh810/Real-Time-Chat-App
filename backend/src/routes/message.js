import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { getUsersForSidebar } from '../controllers/msgController.js';
import { getMessages } from '../controllers/msgController.js';
import { sendMessage } from '../controllers/msgController.js';

const msgRouter = express.Router();

msgRouter.get('/users', protectRoute, getUsersForSidebar);

msgRouter.get('/:id', protectRoute, getMessages);

msgRouter.post('/send/:id', protectRoute, sendMessage);

export default msgRouter;