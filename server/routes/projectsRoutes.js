import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createProjectController, getProjectDetailsController, getProjectTasksController } from "../controllers/projects.controller.js";
import { ProjectSchema } from "../utils/validate-schemas.js";
import { z } from "zod";

const router = Router();

router.post('/:workspaceId/create-project', 
    authMiddleware,
    validateRequest({params: z.object({workspaceId : z.string()}),  body : ProjectSchema}), 
    createProjectController
);

router.get("/:projectId", authMiddleware,
    validateRequest({params: z.object({projectId: z.string()})}), 
    getProjectDetailsController
);

router.get("/:projectId/tasks", 
    authMiddleware, 
    validateRequest({params: z.object({projectId: z.string()})}), 
    getProjectTasksController
)

export default router;