import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";


// here we specify any routes 
const routes: RouteConfig = [
    layout("routes/auth/auth-layout.tsx", [
        index("routes/root/home.tsx"), // This is the home page route /
        route("/login", "routes/auth/login.tsx"),
        route("/signup", "routes/auth/signup.tsx"),
        route("/forgot-password", "routes/auth/forgot-password.tsx"),
        route("/reset-password", "routes/auth/reset-password.tsx"),
        route("/verify-mail", "routes/auth/verify-mail.tsx"),
    ]), 

    layout("routes/dashboard/dashboard-layout.tsx", [
        route("/dashboard", "routes/dashboard/index.tsx"), 
        route("/workspaces", "routes/dashboard/workspaces/index.tsx"),
        route("/workspaces/:workspaceId", "routes/dashboard/workspaces/workspaceDetails.tsx"),
        route("/workspaces/:workspaceId/projects/:projectId", "routes/dashboard/project/projectDetails.tsx"), 
        route("/workspaces/:workspaceId/projects/:projectId/tasks/:taskId", "routes/dashboard/task/taskDetails.tsx"), 
        route("/my-tasks", "routes/dashboard/MyTasks.tsx"),
        route("/members", "routes/dashboard/Members.tsx"),
        route("/completed", "routes/dashboard/Completed.tsx"),
        route("/settings", "routes/dashboard/Settings.tsx"),
    ]), 
    
    route("workspace-invite/:workspaceId", "routes/dashboard/workspaces/workspaceInvite.tsx")
];  

export default routes;
        