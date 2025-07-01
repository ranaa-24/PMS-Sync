import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateRequest } from "zod-express-middleware"
import { z } from "zod";
import { taskSchema } from "../utils/validate-schemas.js";
import { createTaskController } from "../controllers/tasks.controller.js";



const router = Router();

router.post('/:projectId/create-task', authMiddleware, validateRequest(
    {
        params: z.object({
            projectId: z.string(),
        }), 
        body: taskSchema
    }
), createTaskController)



export default router;

