import { Router } from "express";
import { validateRequest } from "zod-express-middleware"
import { workspaceSchema } from "../utils/validate-schemas.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createWorkspceController, getWorkspaces, getWorkspaceDetails, getWorkspaceProjects} from "../controllers/workspace.controller.js";

const router = Router();

// api-v1/workspaces/...

router.post('/', authMiddleware, validateRequest({body : workspaceSchema}), createWorkspceController);
router.get('/', authMiddleware, getWorkspaces);
router.get("/:workspaceId", authMiddleware, getWorkspaceDetails);   // details of that particular wp
router.get("/:workspaceId/projects", authMiddleware, getWorkspaceProjects); // all the projects of that wp




export default router;