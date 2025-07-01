import WorkspaceModel from "../models/Workspace.js";
import ProjectModel from "../models/Projects.js";
import TaskModel from "../models/Tasks.js";

export const createProjectController = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { title, description, members, status, startDate, dueDate, tags } = req.body;
        const workspace = await WorkspaceModel.findById(workspaceId);

        if (!workspace) {
            return res.status(404).json({
                message: "Workspace not found",
            });
        }

        // checking if the current user is a member of the workspace
        const isMember = workspace.members.some(member => member.user.toString() === req.user._id.toString());

        if (!isMember) {
            return res.status(403).json({
                message: "You are not a member of this workspace",
            });
        }

        const tagArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

        const newProject = await ProjectModel.create({
            title,
            description,
            workspace: workspaceId,
            members: members || [],
            status,
            startDate,
            dueDate,
            tags: tagArray,
            createdBy: req.user._id,
        });

        // push the newly created project id to the workspace's projects array {type: objid}
        workspace.projects.push(newProject._id);
        await workspace.save();

        return res.status(201).json({
            newProject,
        });

    } catch (error) {
        console.log("Error in createProjectController:", error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}

export const getProjectDetailsController = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await ProjectModel.findById(projectId);

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        // note members.user is a type of ObjectId so we must convert it to strong 
        const isMember = project.members.some(member => member.user.toString() === req.user._id.toString());
        if (!isMember) {
            return res.status(403).json({
                message: "You are not a member of this project",
            });
        }

        return res.status(200).json(project);

    } catch (error) {
        console.log("Error in getProjectDetailsController:", error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}

export const getProjectTasksController = async (req, res) => {
    try {
        const {projectId} = req.params;
        const project = await ProjectModel.findById(projectId).populate("members.user");

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        //Note: the member.user has been populated so we can directly compare the user id
        const isMember = project.members.some(member => member.user._id.toString() === req.user._id.toString());

        if (!isMember) {
            return res.status(403).json({
                message: "You are not a member of this project",
            });
        }


        const tasks = await TaskModel.find({ project : projectId, isArchived: false }).populate("assignees", "name profilePic").sort({createdAt: -1});

        return res.status(200).json({
            project, 
            tasks,
        })

    
    } catch (error) {
        console.log("Error in getProjectTasksController:", error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }

}