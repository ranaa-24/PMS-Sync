import WorkspaceModel from "../models/Workspace.js";
import ProjectModel from "../models/Projects.js";
import User from "../models/Users.js";
import WorkspaceInvite from "../models/WorkspaceInvite.js";
import jwt from "jsonwebtoken";
import sendMail from "../utils/send-mail.js";
import { recordActivity } from "../utils/index.js";

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
        const workspace = await WorkspaceModel.findById({ _id: workspaceId }).populate("members.user", "name email profilePic");

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
            // 'members.user': req.user._id
        })
            // .populate("tasks", "status")
            .sort({ createdAt: -1 });


        return res.status(200).json({
            workspace,
            projects
        });

    } catch (error) {
        console.log("Error in getWorkspaceProjects", error);
        return res.status(500).json({ message: "Internal Server error." })
    }

}


const getWorkspaceStats = async (req, res) => {
    try {
        const { workspaceId } = req.params;

        const workspace = await WorkspaceModel.findById(workspaceId);

        if (!workspace) {
            return res.status(404).json({
                message: "Workspace not found",
            });
        }

        const isMember = workspace.members.some(
            (member) => member.user.toString() === req.user._id.toString()
        );

        if (!isMember) {
            return res.status(403).json({
                message: "You are not a member of this workspace",
            });
        }

        const [totalProjects, projects] = await Promise.all([
            ProjectModel.countDocuments({ workspace: workspaceId }),
            ProjectModel.find({ workspace: workspaceId })
                .populate(
                    "tasks",
                    "title status dueDate project updatedAt isArchived priority"
                )
                .sort({ createdAt: -1 }),
        ]);

        const totalTasks = projects.reduce((acc, project) => {
            return acc + project.tasks.length;
        }, 0);

        const totalProjectInProgress = projects.filter(
            (project) => project.status === "In Progress"
        ).length;


        const totalTaskCompleted = projects.reduce((acc, project) => {
            return (
                acc + project.tasks.filter((task) => task.status === "Done").length
            );
        }, 0);

        const totalTaskToDo = projects.reduce((acc, project) => {
            return (
                acc + project.tasks.filter((task) => task.status === "To Do").length
            );
        }, 0);

        const totalTaskInProgress = projects.reduce((acc, project) => {
            return (
                acc +
                project.tasks.filter((task) => task.status === "In Progress").length
            );
        }, 0);

        // [[tasks..], [tasks..]] ==> project is array which conatiner agan arry
        const tasks = projects.flatMap((project) => project.tasks);

        const upcomingTasks = tasks.filter((task) => {
            const taskDate = new Date(task.dueDate);
            const today = new Date();
            return (
                taskDate > today &&
                taskDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
            );
        });

        const taskTrendsData = [
            { name: "Sun", completed: 0, inProgress: 0, toDo: 0 },
            { name: "Mon", completed: 0, inProgress: 0, toDo: 0 },
            { name: "Tue", completed: 0, inProgress: 0, toDo: 0 },
            { name: "Wed", completed: 0, inProgress: 0, toDo: 0 },
            { name: "Thu", completed: 0, inProgress: 0, toDo: 0 },
            { name: "Fri", completed: 0, inProgress: 0, toDo: 0 },
            { name: "Sat", completed: 0, inProgress: 0, toDo: 0 },
        ];

        // get last 7 days tasks date
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date;
        }).reverse();


        for (const project of projects) {
            for (const task of project.tasks) {
                const taskDate = new Date(task.updatedAt);

                const dayInDate = last7Days.findIndex(
                    (date) =>
                        date.getDate() === taskDate.getDate() &&
                        date.getMonth() === taskDate.getMonth() &&
                        date.getFullYear() === taskDate.getFullYear()
                );

                if (dayInDate !== -1) {
                    const dayName = last7Days[dayInDate].toLocaleDateString("en-US", {
                        weekday: "short",
                    });

                    const dayData = taskTrendsData.find((day) => day.name === dayName);

                    if (dayData) {
                        switch (task.status) {
                            case "Done":
                                dayData.completed++;
                                break;
                            case "In Progress":
                                dayData.inProgress++;
                                break;
                            case "To Do":
                                dayData.toDo++;
                                break;
                        }
                    }
                }
            }
        }

        const projectStatusData = [
            { name: "Completed", value: 0, color: "#10b981" },
            { name: "In Progress", value: 0, color: "#3b82f6" },
            { name: "Planning", value: 0, color: "#f59e0b" },
        ];

        for (const project of projects) {
            switch (project.status) {
                case "Completed":
                    projectStatusData[0].value++;
                    break;
                case "In Progress":
                    projectStatusData[1].value++;
                    break;
                case "Planning":
                    projectStatusData[2].value++;
                    break;
            }
        }

        const taskPriorityData = [
            { name: "High", value: 0, color: "#ef4444" },
            { name: "Medium", value: 0, color: "#f59e0b" },
            { name: "Low", value: 0, color: "#6b7280" },
        ];

        for (const task of tasks) {
            switch (task.priority) {
                case "High":
                    taskPriorityData[0].value++;
                    break;
                case "Medium":
                    taskPriorityData[1].value++;
                    break;
                case "Low":
                    taskPriorityData[2].value++;
                    break;
            }
        }

        const workspaceProductivityData = [];

        for (const project of projects) {
            const projectTask = tasks.filter(
                (task) => task.project.toString() === project._id.toString()
            );

            const completedTask = projectTask.filter(
                (task) => task.status === "Done" && task.isArchived === false
            );

            workspaceProductivityData.push({
                name: project.title,
                completed: completedTask.length,
                total: projectTask.length,
            });
        }

        const stats = {
            totalProjects,
            totalTasks,
            totalProjectInProgress,
            totalTaskCompleted,
            totalTaskToDo,
            totalTaskInProgress,
        };

        return res.status(200).json({
            stats,
            taskTrendsData,
            projectStatusData,
            taskPriorityData,
            workspaceProductivityData,
            upcomingTasks,
            recentProjects: projects.slice(0, 5),
        });

    } catch (error) {
        console.log("Error in getWorkspaceStats", error);
        return res.status(500).json({ message: "Internal Server error." });
    }
}


// ------------------------------

const acceptInviteToken = async (req, res) => {

    try {
        const { token } = req.body;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { user, workspaceId, role } = decoded;

        const workspace = await WorkspaceModel.findById(workspaceId);

        if (!workspace) {
            return res.status(404).json({
                message: "Workspace not found",
            });
        }

        const isMember = workspace.members.some(
            (member) => member.user.toString() === user.toString()
        );

        if (isMember) {
            return res.status(400).json({
                message: "User already a member of this workspace",
            });
        }

        const inviteInfo = await WorkspaceInvite.findOne({
            user: user,
            workspaceId: workspaceId,
        });

        if (!inviteInfo) {
            return res.status(404).json({
                message: "Invitation not found",
            });
        }

        if (inviteInfo.expiresAt < new Date()) {
            return res.status(400).json({
                message: "Invitation has expired",
            });
        }

        workspace.members.push({
            user: user,
            role: role || "member",
            joinedAt: new Date(),
        });

        await workspace.save();

        await Promise.all([
            WorkspaceInvite.deleteOne({ _id: inviteInfo._id }),
            recordActivity(user, "joined_workspace", "Workspace", workspaceId, {
                description: `Joined ${workspace.name} workspace`,
            }),
        ]);

        return res.status(200).json({
            message: "Invitation accepted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}

const inviteUserToWorkspace = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { email, role } = req.body;

        const workspace = await WorkspaceModel.findById(workspaceId);

        if (!workspace) {
            return res.status(404).json({
                message: "Workspace not found",
            });
        }

        const userMemberInfo = workspace.members.find(
            (member) => member.user.toString() === req.user._id.toString()
        );

        if (!userMemberInfo || !["admin", "owner"].includes(userMemberInfo.role)) {
            return res.status(403).json({
                message: "You are not authorized to invite members to this workspace",
            });
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({
                message: "User not found",
            });
        }

        const isMember = workspace.members.some(
            (member) => member.user.toString() === existingUser._id.toString()
        );

        if (isMember) {
            return res.status(400).json({
                message: "User already a member of this workspace",
            });
        }

        const isInvited = await WorkspaceInvite.findOne({
            user: existingUser._id,
            workspaceId: workspaceId,
        });

        if (isInvited && isInvited.expiresAt > new Date()) {
            return res.status(400).json({
                message: "User already invited to this workspace",
            });
        }

        if (isInvited && isInvited.expiresAt < new Date()) {
            await WorkspaceInvite.deleteOne({ _id: isInvited._id });
        }

        const inviteToken = jwt.sign(
            {
                user: existingUser._id,
                workspaceId: workspaceId,
                role: role || "member",
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        await WorkspaceInvite.create({
            user: existingUser._id,
            workspaceId: workspaceId,
            token: inviteToken,
            role: role || "member",
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        const invitationLink = `${process.env.FRONTEND_URL}/workspace-invite/${workspace._id}?tk=${inviteToken}`;

        const emailContent = `
      <p>You have been invited to join ${workspace.name} workspace</p>
      <p>Click here to join: <a href="${invitationLink}">${invitationLink}</a></p>
    `;

        await sendMail(
            email,
            "You have been invited to join a workspace",
            emailContent
        );

        return res.status(200).json({
            message: "Invitation sent successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}


const acceptGenerateInvite = async (req, res) => {
    try {
        const { workspaceId } = req.params;

        const workspace = await WorkspaceModel.findById(workspaceId);

        if (!workspace) {
            return res.status(404).json({
                message: "Workspace not found",
            });
        }

        const isMember = workspace.members.some(
            (member) => member.user.toString() === req.user._id.toString()
        );

        if (isMember) {
            return res.status(400).json({
                message: "You are already a member of this workspace",
            });
        }

        workspace.members.push({
            user: req.user._id,
            role: "member",
            joinedAt: new Date(),
        });

        await workspace.save();

        await recordActivity(
            req.user._id,
            "joined_workspace",
            "Workspace",
            workspaceId,
            {
                description: `Joined ${workspace.name} workspace`,
            }
        );

        return res.status(200).json({
            message: "Invitation accepted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}

export { inviteUserToWorkspace, acceptGenerateInvite, createWorkspceController, acceptInviteToken, getWorkspaces, getWorkspaceDetails, getWorkspaceProjects, getWorkspaceStats }