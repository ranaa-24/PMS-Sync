import Loader from "@/components/common/Loader";
import TaskStatusSelector from "@/components/layouts/tasks/TaskStatusSelector";
import TaskTitle from "@/components/layouts/tasks/TaskTitle";
import BackButton from "@/components/layouts/workspaces/backButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTaskByIdQuery } from "@/hooks/useTasks";
import { useAuthContext } from "@/providers/auth.context";
import type { ProjectType, TaskType } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, useParams } from "react-router";



const TaskDetails = () => {
    const { workspaceId, projectId, taskId } = useParams<{ workspaceId: string, projectId: string, taskId: string }>()
    const navigate = useNavigate();

    const { user } = useAuthContext();


    const { data, isLoading } = useTaskByIdQuery(taskId!) as {
        data: { task: TaskType, project: ProjectType },
        isLoading: boolean
    };


    if (!data && !isLoading) {
        return (
            <div className='h-full flex items-center justify-center text-secondary-font'>
                No Task found..
            </div>
        );
    }

    if (isLoading) {
        return <div className='w-full h-full flex flex-col justify-center items-center'>
            <Loader />
        </div>
    }

    const { task, project } = data;

    const isUserWatching = task?.watchers?.some(watcher => watcher._id.toString() == user?._id.toString())

    const goBack = () => navigate(-1);

    const members = task?.assignees || [];


    return <div className="container mx-auto p-0 py-4 md:px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">

            <div className="flex flex-col justify-center md:flex-row md:items-center">
                <BackButton />

                <h1 className="text-xl md:text-3xl font-bold break-all line-clamp-1">{task.title}</h1>

                {task.isArchived && (
                    <Badge
                        className="ml-4 bg-theme-secondary/20 text-theme-secondary border-theme-secondary/80 font-semibold px-3 py-1 rounded"
                        variant="outline"
                    >
                        Archived
                    </Badge>
                )}

            </div>

            <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0">
                <Button
                    variant={"outline"}
                    size="sm"
                    onClick={() => { }}
                    className={`w-full md:w-auto flex items-center justify-center font-medium border border-theme-primary/60 ${isUserWatching ? "bg-theme-secondary/10 text-theme-secondary" : "bg-theme-primary/90 text-white"
                        } hover:bg-theme-primary/80 transition`}
                >
                    {isUserWatching ? (
                        <>
                            <EyeOff className="mr-2 size-4" />
                            <span>Unwatch</span>
                        </>
                    ) : (
                        <>
                            <Eye className="mr-2 size-4" />
                            <span>Watch</span>
                        </>
                    )}
                </Button>

                <Button
                    variant={"outline"}
                    size="sm"
                    // onClick={handleAchievedTask}
                    className={`w-full md:w-auto flex items-center justify-center font-medium border border-theme-primary/60 ${task.isArchived
                            ? "bg-theme-secondary/10 text-theme-secondary"
                            : "bg-theme-primary/90 text-white"
                        } hover:bg-theme-primary/80 transition`}
                >
                    <span>{task.isArchived ? "Unarchive" : "Archive"}</span>
                </Button>
            </div>
        </div>

        <div className="flex flex-col gap-6">
            <div className="lg:col-span-2">
                <div className="bg-surface border border-glass-shadow rounded-lg p-6 shadow-sm mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start">
                        <div>
                            <Badge
                                className={`${task.priority === "High"
                                        ? "bg-theme-secondary/20 text-theme-secondary border-theme-secondary/80"
                                        : task.priority === "Medium"
                                            ? "bg-red-300/20 text-red-300 border-red-300/80"
                                            : "bg-theme-primary/10 text-theme-primary border-theme-primary/60"}`}

                                variant="outline"
                            >
                                {task.priority} Priority
                            </Badge>


                            <TaskTitle title={task.title} taskId={task._id} />

                            <div className="text-sm text-secondary-font">
                                Created at:{" "}
                                {formatDistanceToNow(new Date(task.createdAt), {
                                    addSuffix: true,
                                })}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-4 md:mt-0">
                            <TaskStatusSelector status={task.status} taskId={task._id} />

                            <Button
                                variant={"destructive"}
                                size="sm"
                                onClick={() => { }}
                                className="hidden md:block"
                            >
                                Delete Task
                            </Button>
                        </div>
                    </div>

                    {/* <div className="mb-6">
                        <h3 className="text-sm font-medium text-muted-foreground mb-0">
                            Description
                        </h3>

                        <TaskDescription
                            description={task.description || ""}
                            taskId={task._id}
                        />
                    </div> */}

                    {/* <TaskAssigneesSelector
                        task={task}
                        assignees={task.assignees}
                        projectMembers={project.members as any}
                    />

                    <TaskPrioritySelector priority={task.priority} taskId={task._id} />

                    <SubTasksDetails subTasks={task.subtasks || []} taskId={task._id} /> */}
                </div>

                {/* <CommentSection taskId={task._id} members={project.members as any} /> */}
            </div>

            {/* <div className="w-full">
                <Watchers watchers={task.watchers || []} />

                <TaskActivity resourceId={task._id} />
            </div> */}
        </div>


    </div>
}

export default TaskDetails;