import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createProjectController } from "../controllers/projects.controller.js";
import { ProjectSchema } from "../utils/validate-schemas.js";
import { z } from "zod";

const router = Router();

router.post('/:workspaceId/create-project', 
    authMiddleware,
    validateRequest({params: z.object({workspaceId : z.string()}),  body : ProjectSchema}), 
    createProjectController
)

export default router;