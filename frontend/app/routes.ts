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
    ]), 
    
];  

export default routes;
        