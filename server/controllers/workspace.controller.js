import WorkspaceModel from "../models/Workspace.js";
import ProjectModel from "../models/Projects.js";

const createWorkspceController = async (req, res) => {
    try {
        const { name, description, color } = req.body;

        const workspace = await WorkspaceModel.create({
            name, description, color,
            owner: req.user._id,
            members: [
                {
                    user: req.user._id,
                    role: 'owner',
                    joinedAt: new Date(),
                },
            ],
        });

        return res.status(201).json({
            message: "Workspace Addeed Successfully",
            workspace
        });

    } catch (error) {
        console.log("Error in createWorspace controller", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


const getWorkspaces = async (req, res) => {
    try {
        const workspaces = await WorkspaceModel.find({
            "members.user": req.user._id           // req.user is the current login user, 
        }).sort({ createdAt: -1 });

        return res.status(200).json(workspaces)

    } catch (error) {
        console.log("Error in getWorkspace", error);
        return res.status(500).json({ message: "Internal Server error." })
    }
}


const getWorkspaceDetails = async (req, res) => {
    try {
        const { workspaceId } = req.params;

        //only include the name, email, and profilePic 
        const workspace = await WorkspaceModel.findOne({ _id: workspaceId, "members.user": req.user._id }).populate("members.user", "name email profilePic");

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found." });
        }

        return res.status(200).json(workspace);

    } catch (error) {
        console.log("Error in getWorkspaceDetails", error);
        return res.status(500).json({ message: "Internal Server error." })
    }
}

// all the projects 
const getWorkspaceProjects = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        // findin a wp not only with the wp id but also with the current user id, what if some user get access to a wp which is not his.
        const workspace = await WorkspaceModel.findOne({ _id: workspaceId, "members.user": req.user._id }).populate("members.user", "name email profilePic");

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found." });
        }

        const projects = await ProjectModel.find({
            workspace: workspaceId,
            isArchived: false,
            'members.user': req.user._id
        }).populate("tasks", "status").sort({ createdAt: -1 });


        return res.status(200).json({
            workspace,
            projects
        });

    } catch (error) {
        console.log("Error in getWorkspaceProjects", error);
        return res.status(500).json({ message: "Internal Server error." })
    }

}

export { createWorkspceController, getWorkspaces, getWorkspaceDetails, getWorkspaceProjects }