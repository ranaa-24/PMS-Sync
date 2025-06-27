import WorkspaceModel from "../models/Workspace.js";
import ProjectModel from "../models/Projects.js";

export const createProjectController = async (req, res) => {
    try {
        const {workspaceId} = req.params;
        const {title, description, members, status, startDate, dueDate, tags } = req.body;
        const workspace = await WorkspaceModel.findById(workspaceId);
        
        if (!workspace) {
            return res.status(404).json({
                message: "Workspace not found",
            });
        }

        // checking if the current user is a member of the workspace
        const isMember = workspace.members.some(member => member.user.toString() === req.user._id.toString());

        if(!isMember) {
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
