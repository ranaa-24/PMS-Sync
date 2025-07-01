import {Router} from 'express';
import authRoutes from './authRoutes.js';
import workspaceRoutes from './workspaceRoutes.js'
import projectsRoutes from './projectsRoutes.js'
import tasksRoutes from './tasksRoutes.js'

const router = Router();

router.use('/auth', authRoutes);   // /auth/login, /auth/register, etc.
router.use('/workspaces', workspaceRoutes);         // /workspaces/
router.use('/projects', projectsRoutes);         // /projects/
router.use('/tasks', tasksRoutes);         // /tasks/


export default router;
