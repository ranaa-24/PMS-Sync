import ProjectModel from "../models/Projects.js";
import WorkspaceModel from "../models/Workspace.js";
import TaskModel from "../models/Tasks.js";
import { recordActivity } from "../utils/index.js";

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
        
        const {taskId} = req.params;
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
    try{
        const {taskId} = req.params;
        const {title} = req.body;

        const task = await TaskModel.findById(taskId);
        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        const project = await ProjectModel.findById(task.project);
        if(!project){
            return res.status(404).json({
                message: "Project not found",
            });
        }

        const isMember = project.members.some((member) => member.user.toString() === req.user._id.toString());

        if(!isMember) {
            return res.status(403).json({
                message: "You are not a member of this project",
            });
        }

        const oldTitle = task.title;
        task.title = title;
        await task.save(); 

        await recordActivity(req.user._id, "updated_task", "Task", taskId, {description: `Title changed from "${oldTitle}" to "${title}"`});

        return res.status(200).json({
            task
        });

    }catch(error) {
        console.log("Error in updateTaskTitle :", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export const updateDescription = async (req, res) => {
    try{
        const {taskId} = req.params;
        const { description } = req.body;

        const task = await TaskModel.findById(taskId);
        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        const project = await ProjectModel.findById(task.project);
        if(!project){
            return res.status(404).json({
                message: "Project not found",
            });
        }

        const isMember = project.members.some((member) => member.user.toString() === req.user._id.toString());

        if(!isMember) {
            return res.status(403).json({
                message: "You are not a member of this project",
            });
        }

        const oldDes = task.description.substring(0, 50) + "...";
        const newDes = description.substring(0, 50) + "...";

        task.description = description;
        await task.save(); 

        await recordActivity(req.user._id, "updated_task", "Task", taskId, {description: `Description changed from "${oldDes}" to "${newDes}"`});

        return res.status(200).json({
            task
        });

    }catch(error) {
        console.log("Error in updateDescription:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}