import {Router} from 'express';
import authRoutes from './authRoutes.js';
import workspaceRoutes from './workspaceRoutes.js'


const router = Router();

router.use('/auth', authRoutes);   // /auth/login, /auth/register, etc.
router.use('/workspaces', workspaceRoutes);         // /workspaces/

export default router;
