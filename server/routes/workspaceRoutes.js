import { Router } from "express";
import { validateRequest } from "zod-express-middleware"
import { inviteMemberSchema, workspaceSchema } from "../utils/validate-schemas.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createWorkspceController, getWorkspaces, getWorkspaceDetails, getWorkspaceProjects, getWorkspaceStats, acceptGenerateInvite, acceptInviteToken, inviteUserToWorkspace } from "../controllers/workspace.controller.js";
import { z } from "zod"


const router = Router();

// api-v1/workspaces/...

router.post('/', authMiddleware, validateRequest({ body: workspaceSchema }), createWorkspceController);
router.get('/', authMiddleware, getWorkspaces);
router.get("/:workspaceId", authMiddleware, getWorkspaceDetails);   // details of that particular wp
router.get("/:workspaceId/projects", authMiddleware, getWorkspaceProjects); // all the projects of that wp
router.get("/:workspaceId/stats", authMiddleware, getWorkspaceStats);


router.post("/accept-invite-token", authMiddleware, validateRequest({
    body: z.object({ token: z.string() })
}), acceptInviteToken)

router.post(
  "/:workspaceId/invite-member",
  authMiddleware,
  validateRequest({
    params: z.object({ workspaceId: z.string() }),
    body: inviteMemberSchema,
  }),
  inviteUserToWorkspace
);

router.post(
  "/:workspaceId/accept-generate-invite",
  authMiddleware,
  validateRequest({ params: z.object({ workspaceId: z.string() }) }),
  acceptGenerateInvite
);

export default router;