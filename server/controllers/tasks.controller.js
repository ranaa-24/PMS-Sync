import ProjectModel from "../models/Projects.js";
import WorkspaceModel from "../models/Workspace.js";
import TaskModel from "../models/Tasks.js";

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
