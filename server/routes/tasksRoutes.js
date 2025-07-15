import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateRequest } from "zod-express-middleware"
import { string, z } from "zod";
import { taskSchema } from "../utils/validate-schemas.js";
import { createTaskController, getTaskById, getActivityByResourceId, updateTaskTitle, updateDescription, updateTaskStatus, updateTaskAssignees, updateTaskPriority, addSubTask, updateSubTask, getCommentsByTaskId, addComment, archivedTask, watchTask, getMyTasksData} from "../controllers/tasks.controller.js";



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

router.put('/:taskId/status', authMiddleware, validateRequest({
    params: z.object({ taskId: z.string() }),
    body: z.object({ status: z.string() }),
}), updateTaskStatus)

router.put('/:taskId/assignees', authMiddleware, validateRequest({
    params: z.object({ taskId: z.string() }),
    body: z.object({ assignees: z.array(z.string()) }),
}), updateTaskAssignees)

router.put('/:taskId/priority', authMiddleware, validateRequest({
    params: z.object({ taskId: z.string() }),
    body: z.object({ priority: z.string() })
}), updateTaskPriority)

router.post('/:taskId/add-subtask', authMiddleware, validateRequest({
    params: z.object({ taskId: z.string() }),
    body: z.object({ title: z.string() })
}), addSubTask)

router.put('/:taskId/update-subtask/:subTaskId', authMiddleware, validateRequest({
    params: z.object({ taskId: z.string(), subTaskId: z.string()}), 
    body: z.object({completed: z.boolean()}),
}), updateSubTask)

router.get('/:resourceId/activity', authMiddleware, validateRequest({
    params: z.object({resourceId: z.string()}), 
}), getActivityByResourceId)


router.get('/:taskId/comments', authMiddleware, validateRequest({
    params: z.object({taskId: z.string()})
}), getCommentsByTaskId)

router.post('/:taskId/add-comment', authMiddleware, validateRequest({
    params: z.object({ taskId: z.string() }),
    body: z.object({text: z.string()}),
}), addComment)

router.post('/:taskId/watch', authMiddleware, validateRequest({
    params: z.object({ taskId: z.string() })
}), watchTask)

router.post('/:taskId/archived', authMiddleware, validateRequest({
    params: z.object({ taskId: z.string() })
}), archivedTask)

router.get('/my-tasks/get', authMiddleware, getMyTasksData);


export default router;