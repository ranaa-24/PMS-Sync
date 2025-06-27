import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { ProjectType } from "@/types"
import { Link } from "react-router"
import { getTaskStatusColor } from "@/lib/otherUtilities"
import { Progress } from "@/components/ui/progress"

interface PropsTypes {
    project: ProjectType,
    workspaceId: string,
    progress: number
}


function ProjectCard({ project, progress, workspaceId }: PropsTypes) {
    return (
        <Link to={`/workspaces/${workspaceId}/projects/${project._id}`}>
            <Card className={`hover:-translate-y-0.5 transition-all duration-300 cursor-pointer bg-surface text-main-font border-2 border-main-border animate-fade-right animate-once animate-duration-[500ms]`}
            >
                <CardHeader>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg font-semibold truncate">{project.title}</CardTitle>
                            <span
                                className={cn(
                                    "text-xs px-3 py-1 rounded-full font-medium capitalize",
                                    getTaskStatusColor(project.status)
                                )}
                            >
                                {project.status}
                            </span>
                        </div>
                        <CardDescription className="text-sm text-muted-foreground line-clamp-1 break-all">
                            {project.description || "No description provided."}
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-secondary-font font-medium">Progress</span>
                            <span className="text-xs font-semibold text-secondary-font">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2 bg-theme-tertiary border-none w-full" />
                        <div className="flex items-center justify-between mt-2">
                            <span className="inline-flex items-center gap-1 text-xs bg-theme-tertiary/20 text-main-font px-2 py-1 rounded-full font-medium">
                                {project.tasks?.length ?? 0} Tasks
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs bg-theme-tertiary/20 text-main-font px-2 py-1 rounded-full font-medium">
                                Deadline: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "No deadline"}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export default ProjectCard