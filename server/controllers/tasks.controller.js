import ProjectModel from "../models/Projects.js";
import WorkspaceModel from "../models/Workspace.js";
import TaskModel from "../models/Tasks.js";
import { recordActivity } from "../utils/index.js";
import ActivityLogModel from "../models/Activity.js";
import CommentModel from "../models/Comment.js";

export const createTaskController = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { title, description, status, priority, dueDate, assignees } =
            req.body;



        const project = await ProjectModel.findById(projectId);

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }


        const workspace = await WorkspaceModel.findById(project.workspace);

        if (!workspace) {
            return res.status(404).json({
                message: "Workspace not found",
            });
        }

        // if some how user added to the project  but not a part of workspce 
        const isMember = workspace.members.some(
            (member) => member.user.toString() === req.user._id.toString()
        );

        if (!isMember) {
            return res.status(403).json({
                message: "You are not a member of this workspace",
            });
        }

        const newTask = await TaskModel.create({
            title,
            description,
            status,
            priority,
            dueDate,
            assignees,
            project: projectId,
            createdBy: req.user._id,
        });

        project.tasks.push(newTask._id);
        await project.save();

        res.status(201).json(newTask);
    } catch (error) {
        console.log("Error in creatTaskController :", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export const getTaskById = async (req, res) => {
    try {

        const { taskId } = req.params;
        const task = await TaskModel.findById(taskId).populate("assignees", "name profilePic").populate("watchers", "name profilePic");
        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        const project = await ProjectModel.findById(task.project).populate("members.user", "name profilePic");

        return res.status(200).json({
            task,
            project
        });

    } catch (error) {
        console.log("Error in getTaskById :", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export const updateTaskTitle = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { title } = req.body;

        const task = await TaskModel.findById(taskId);
        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        const project = await ProjectModel.findById(task.project);
        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        const isMember = project.members.some((member) => member.user.toString() === req.user._id.toString());

        if (!isMember) {
            return res.status(403).json({
                message: "You are not a member of this project",
            });
        }

        const oldTitle = task.title;
        task.title = title;
        await task.save();

        await recordActivity(req.user._id, "updated_task", "Task", taskId, { description: `Title changed from "${oldTitle}" to "${title}"` });

        return res.status(200).json({
            task
        });

    } catch (error) {
        console.log("Error in updateTaskTitle :", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export const updateDescription = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { description } = req.body;

        const task = await TaskModel.findById(taskId);
        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        const project = await ProjectModel.findById(task.project);
        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        const isMember = project.members.some((member) => member.user.toString() === req.user._id.toString());

        if (!isMember) {
            return res.status(403).json({
                message: "You are not a member of this project",
            });
        }

        const oldDes = task.description.substring(0, 50) + "...";
        const newDes = description.substring(0, 50) + "...";

        task.description = description;
        await task.save();

        await recordActivity(req.user._id, "updated_task", "Task", taskId, { description: `Description changed from "${oldDes}" to "${newDes}"` });

        return res.status(200).json({
            task
        });

    } catch (error) {
        console.log("Error in updateDescription:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export const updateTaskStatus = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;

        const task = await TaskModel.findById(taskId);
        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        const project = await ProjectModel.findById(task.project);
        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        const isMember = project.members.some((member) => member.user.toString() === req.user._id.toString());

        if (!isMember) {
            return res.status(403).json({
                message: "You are not a member of this project",
            });
        }

        const oldStatus = task.status;
        task.status = status;

        await task.save();

        await recordActivity(req.user._id, "updated_task", "Task", taskId, { description: `Status changed from "${oldStatus}" to "${status}"` });

        return res.status(200).json({
            task
        });

    } catch (error) {
        console.log("Error in updateTaskTitle :", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export const updateTaskAssignees = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { assignees } = req.body;

        const task = await TaskModel.findById(taskId);

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        const project = await ProjectModel.findById(task.project);

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        const isMember = project.members.some(
            (member) => member.user.toString() === req.user._id.toString()
        );

        if (!isMember) {
            return res.status(403).json({
                message: "You are not a member of this project",
            });
        }

        const oldAssignees = task.assignees;

        task.assignees = assignees;
        await task.save();

        await recordActivity(req.user._id, "updated_task", "Task", taskId, { description: `Number of ssignees changed from ${oldAssignees.length} to ${assignees.length}` });


        res.status(200).json(task);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export const updateTaskPriority = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { priority } = req.body;

        const task = await TaskModel.findById(taskId);

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        const project = await ProjectModel.findById(task.project);

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        const isMember = project.members.some(
            (member) => member.user.toString() === req.user._id.toString()
        );

        if (!isMember) {
            return res.status(403).json({
                message: "You are not a member of this project",
            });
        }

        const oldPriority = task.priority;

        task.priority = priority;
        await task.save();

        await recordActivity(req.user._id, "updated_task", "Task", taskId, { description: `Priority changed from "${oldPriority}" to "${priority}"` });

        res.status(200).json(task);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export const addSubTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { title } = req.body;

        const task = await TaskModel.findById(taskId);

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        const project = await ProjectModel.findById(task.project);

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        const isMember = project.members.some(
            (member) => member.user.toString() === req.user._id.toString()
        );

        if (!isMember) {
            return res.status(403).json({
                message: "You are not a member of this project",
            });
        }

        const newSubTask = {
            title,
            completed: false,
        };

        task.subtasks.push(newSubTask);
        await task.save();

        await recordActivity(req.user._id, "created_subtask", "Task", taskId, {
            description: `created subtask ${title}`,
        });

        res.status(201).json(task);
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const updateSubTask = async (req, res) => {
    try {
        const { taskId, subTaskId } = req.params;
        const { completed } = req.body;

        const task = await TaskModel.findById(taskId);

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        const subTask = task.subtasks.find(
            (subTask) => subTask._id.toString() === subTaskId
        );

        if (!subTask) {
            return res.status(404).json({
                message: "Subtask not found",
            });
        }

        subTask.completed = completed;
        await task.save();

        await recordActivity(req.user._id, "updated_subtask", "Task", taskId, {
            description: `Updated subtask ${subTask.title}`,
        });

        res.status(200).json(task);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const getActivityByResourceId = async (req, res) => {
    try {
        const { resourceId } = req.params;

        const activity = await ActivityLogModel.find({ resourceId })
            .populate("user", "name profilePic")
            .sort({ createdAt: -1 });

        res.status(200).json(activity);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export const getCommentsByTaskId = async (req, res) => {
    try {
        const { taskId } = req.params;

        const comments = await CommentModel.find({ task: taskId })
            .populate("author", "name profilePic")
            .sort({ createdAt: -1 });

        res.status(200).json(comments);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export const addComment = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { text } = req.body;

        const task = await TaskModel.findById(taskId);

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        const project = await ProjectModel.findById(task.project);

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        const isMember = project.members.some(
            (member) => member.user.toString() === req.user._id.toString()
        );

        if (!isMember) {
            return res.status(403).json({
                message: "You are not a member of this project",
            });
        }

        const newComment = await CommentModel.create({
            text,
            task: taskId,
            author: req.user._id,
        });

        task.comments.push(newComment._id);
        await task.save();

        await recordActivity(req.user._id, "added_comment", "Task", taskId, {
            description: `added comment ${text.substring(0, 50) + (text.length > 50 ? "..." : "")
                }`,
        });

        res.status(201).json(newComment);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export const watchTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const task = await TaskModel.findById(taskId);

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        const project = await ProjectModel.findById(task.project);

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        const isMember = project.members.some(
            (member) => member.user.toString() === req.user._id.toString()
        );

        if (!isMember) {
            return res.status(403).json({
                message: "You are not a member of this project",
            });
        }

        const isWatching = task.watchers.includes(req.user._id);

        /// if u are wathcin already then remove your self
        if (!isWatching) {
            task.watchers.push(req.user._id);
        } else {
            task.watchers = task.watchers.filter(
                (watcher) => watcher.toString() !== req.user._id.toString()
            );
        }

        await task.save();

        await recordActivity(req.user._id, "updated_task", "Task", taskId, {
            description: `${isWatching ? "stopped watching" : "started watching"
                } task ${task.title}`,
        });

        res.status(200).json(task);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export const archivedTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const task = await TaskModel.findById(taskId);

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        const project = await ProjectModel.findById(task.project);

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        const isMember = project.members.some(
            (member) => member.user.toString() === req.user._id.toString()
        );

        if (!isMember) {
            return res.status(403).json({
                message: "You are not a member of this project",
            });
        }
        const isAchieved = task.isArchived;

        task.isArchived = !isAchieved;
        await task.save();

        await recordActivity(req.user._id, "updated_task", "Task", taskId, {
            description: `${isAchieved ? "unachieved" : "achieved"} task ${task.title
                }`,
        });

        res.status(200).json(task);
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export const getMyTasksData = async (req, res) => {
    try {
    const tasks = await TaskModel.find({ assignees: req.user._id })
      .populate("project", "title workspace")
      .sort({ createdAt: -1 });

    return res.status(200).json(tasks);
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}