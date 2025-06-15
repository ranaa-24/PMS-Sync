import {Router} from 'express';
import authRoutes from './authRoutes.js';
   
const router = Router();

router.use('/auth', authRoutes);   // /auth/login, /auth/register, etc.


export default router;
