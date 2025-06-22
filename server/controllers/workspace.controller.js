import WorkspaceModel from "../models/Workspace.js";

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
            "members.user" : req.user._id           // req.user is the current login user, 
        }).sort({createdAt: -1});

        return res.status(200).json(workspaces)
        
    } catch (error) {
        console.log("Error in getWorkspace", error);
        return res.status(500).json({message : "Internal Server error."})
    }
}


export {createWorkspceController, getWorkspaces}