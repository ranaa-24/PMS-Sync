import { Router } from "express";
import { validateRequest } from "zod-express-middleware"
import { workspaceSchema } from "../utils/validate-schemas.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createWorkspceController } from "../controllers/workspace.controller.js";

const router = Router();

router.post('/', authMiddleware, validateRequest({body : workspaceSchema}), createWorkspceController);

export default router;