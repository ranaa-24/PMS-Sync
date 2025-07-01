import type { ProjectStatus, TaskStatus } from "@/types";

export const publicRoutes = ['/signup', '/login', '/forgot-password', '/reset-password', '/verify-mail', '/'];

// PLANNING = "Planning",
//   IN_PROGRESS = "In Progress",
//   COMPLETED = "Completed",
//   ON_HOLD = "On Hold",
//   CANCELLED = "Cancelled",

export const getTaskStatusColor = (status: ProjectStatus) => {
    switch (status) {
        case "Planning":
            return "bg-purple-500/20 border border-purple-500/80 text-purple-300";
        case "In Progress":
            return "bg-sky-500/20 border border-sky-500/80 text-sky-300";
        case "Completed":
            return "bg-emerald-500/20 border border-emerald-500/80 text-emerald-300";
        case "On Hold":
            return "bg-pink-500/20 border border-pink-500/80 text-pink-300";
        case "Cancelled":
            return "bg-rose-500/20 border border-rose-500/80 text-rose-300";
        default:
            return "bg-gray-500/20 border border-gray-500/80 text-gray-300";
    };
};

export const getProjectProgress = (tasks: {status: TaskStatus}[]): number => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === "Done").length

    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    
    return progress;
}