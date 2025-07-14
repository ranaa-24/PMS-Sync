import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateRequest } from "zod-express-middleware"
import { z } from "zod";
import { taskSchema } from "../utils/validate-schemas.js";
import { createTaskController, getTaskById, updateTaskTitle, updateDescription } from "../controllers/tasks.controller.js";



const router = Router();

router.post('/:projectId/create-task', authMiddleware, validateRequest(
    {
        params: z.object({
            projectId: z.string(),
        }), 
        body: taskSchema
    }
), createTaskController)

router.get('/:taskId', authMiddleware, validateRequest({
    params: z.object({
        taskId: z.string(),
    }),
}), getTaskById)


router.put('/:taskId/title', authMiddleware, validateRequest({
    params: z.object({
        taskId: z.string()
    }), 

    body: z.object({
        title: z.string()
    })
}), updateTaskTitle);

router.put('/:taskId/description', authMiddleware, validateRequest({
    params: z.object({
        taskId: z.string()
    }),
    body: z.object({
        description: z.string()
    })
}), updateDescription)


export default router;

