import { useState } from 'react';
import { useNavigate, useParams } from 'react-router'
import { type ProjectType, type TaskStatus, type TaskType } from '@/types';
import { useProjectQuery } from '@/hooks/useProjects';
import Loader from '@/components/common/Loader';
import { getProjectProgress } from '@/lib/otherUtilities';
import BackButton from '@/components/layouts/workspaces/backButton';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

import CreateTaskDialog from '@/components/layouts/tasks/createTaskDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AlertCircle, Calendar, CheckCircleIcon, ClockFadingIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';


function ProjectDetails() {
    const { workspaceId, projectId } = useParams<{ workspaceId: string, projectId: string }>();
    console.log(workspaceId);

    const navigate = useNavigate();

    const [isCreateTask, setIsCreateTask] = useState<boolean>(false);
    const [taskFilter, setTaskFilter] = useState<TaskStatus | "All">("All");

    const { data, isLoading } = useProjectQuery(projectId!) as {
        data: {
            tasks: TaskType[],
            project: ProjectType;
        };
        isLoading: boolean;
    };

    if (!data && !isLoading) {
        return (
            <div className='h-full flex items-center justify-center text-secondary-font'>
                No project found..
            </div>
        );
    }

    if (isLoading) {
        return <div className='w-full h-full flex flex-col justify-center items-center'>
            <Loader />
        </div>
    }

    const { tasks, project } = data;

    const projectProgress = getProjectProgress(tasks);

    const handleTaskClick = (taskId: string) => {
        navigate(`/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`);
    }


    return (
        <div className='space-y-8'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                <div>
                    <BackButton />
                    <div className="flex items-center gap-3 mt-4">
                        <h1 className='text-2xl md:text-3xl text-main-font font-bold'> {project.title} </h1>
                    </div>
                    {project.description && <p className='text-sm md:text-base text-secondary-font break-all  max-h-14'>{project.description}</p>}
                </div>

                <div className='flex flex-col md:flex-row gap-3'>
                    <div className='flex items-center gap-3 min-w-48'>
                        <div className='text-sm text-secondary-font'>Progress: </div>
                        <div className='flex-1'>
                            <Progress value={projectProgress} className='h-2' />
                        </div>
                        <span className='text-sm text-secondary-font'>
                            {projectProgress}%
                        </span>
                    </div>

                    <Button className="justify-center text-xs md:text-sm  bg-theme-primary text-main-font border-main-border border-2 hover:bg-theme-primary/80 font-bold" onClick={() => setIsCreateTask(true)}>
                        <span>Add Task</span>
                    </Button>
                </div>
            </div>

            {/* make it responsive */}

            <div className="flex items-center justify-between">
                <Tabs defaultValue="all" className="w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <TabsList className="bg-surface border border-main-border rounded-lg p-1 flex md:gap-2 shadow-sm md:px-2">
                            <TabsTrigger
                                value="all"
                                onClick={() => setTaskFilter("All")}
                                className="data-[state=active]:bg-theme-tertiary data-[state=active]:text-main-bg font-semibold text-sm px-4 py-2 rounded text-main-font cursor-pointer hover:bg-theme-tertiary/20 hover:text-main-font transition-colors duration-300"
                            >
                                All Tasks
                            </TabsTrigger>
                            <TabsTrigger
                                value="todo"
                                onClick={() => setTaskFilter("To Do")}
                                className="data-[state=active]:bg-theme-tertiary data-[state=active]:text-main-bg font-semibold text-sm px-4 py-2 rounded text-main-font cursor-pointer hover:bg-theme-tertiary/20 hover:text-main-font transition-colors duration-300"
                            >
                                To Do
                            </TabsTrigger>
                            <TabsTrigger
                                value="in-progress"
                                onClick={() => setTaskFilter("In Progress")}
                                className="data-[state=active]:bg-theme-tertiary data-[state=active]:text-main-bg font-semibold text-sm px-4 py-2 rounded text-main-font cursor-pointer hover:bg-theme-tertiary/20 hover:text-main-font transition-colors duration-300"
                            >
                                In Progress
                            </TabsTrigger>
                            <TabsTrigger
                                value="done"
                                onClick={() => setTaskFilter("Done")}
                                className="data-[state=active]:bg-theme-tertiary data-[state=active]:text-main-bg font-semibold text-sm px-4 py-2 rounded text-main-font cursor-pointer hover:bg-theme-tertiary/20 hover:text-main-font transition-colors duration-300"
                            >
                                Done
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex items-center gap-3 text-sm">
                            <span className="text-muted-foreground mr-2">Status:</span>
                            <Badge
                                variant="outline"
                                className="flex items-center gap-1 bg-surface border-theme-primary text-theme-primary px-2 py-1"
                            >
                                <AlertCircle className="w-4 h-4" />
                                {tasks.filter((task) => task.status === "To Do").length} To Do
                            </Badge>
                            <Badge
                                variant="outline"
                                className="flex items-center gap-1 bg-surface border-orange-400 text-orange-500 px-2 py-1"
                            >
                                <ClockFadingIcon className="w-4 h-4" />
                                {tasks.filter((task) => task.status === "In Progress").length} In Progress
                            </Badge>
                            <Badge
                                variant="outline"
                                className="flex items-center gap-1 bg-surface border-green-500 text-green-600 px-2 py-1"
                            >
                                <CheckCircleIcon className="w-4 h-4" />
                                {tasks.filter((task) => task.status === "Done").length} Done
                            </Badge>
                        </div>
                    </div>

                    <TabsContent value="all" className="m-0">
                        <div className="grid lg:grid-cols-3 gap-4 mb-4">
                            <TaskColumn
                                title="To Do"
                                tasks={tasks.filter((task) => task.status === "To Do")}
                                onTaskClick={handleTaskClick}
                            />

                            <TaskColumn
                                title="In Progress"
                                tasks={tasks.filter((task) => task.status === "In Progress")}
                                onTaskClick={handleTaskClick}
                            />

                            <TaskColumn
                                title="Done"
                                tasks={tasks.filter((task) => task.status === "Done")}
                                onTaskClick={handleTaskClick}
                            />

                        </div>
                    </TabsContent>

                    <TabsContent value="todo" className="m-0">
                        <div className="grid md:grid-cols-1 gap-4">
                            <TaskColumn
                                title="To Do"
                                tasks={tasks.filter((task) => task.status === "To Do")}
                                onTaskClick={handleTaskClick}
                                isFullWidth
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="in-progress" className="m-0">
                        <div className="grid md:grid-cols-1 gap-4">
                            <TaskColumn
                                title="In Progress"
                                tasks={tasks.filter((task) => task.status === "In Progress")}
                                onTaskClick={handleTaskClick}
                                isFullWidth
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="done" className="m-0">
                        <div className="grid md:grid-cols-1 gap-4">
                            <TaskColumn
                                title="Done"
                                tasks={tasks.filter((task) => task.status === "Done")}
                                onTaskClick={handleTaskClick}
                                isFullWidth
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>


            {/* create task dialog  */}
            <CreateTaskDialog open={isCreateTask} onOpenChange={setIsCreateTask} projectId={projectId!} projectMembers={project.members as any} />
        </div>
    )
}

export default ProjectDetails;

interface TaskColumnProps {
    title: string;
    tasks: TaskType[];
    onTaskClick: (taskId: string) => void;
    isFullWidth?: boolean;
}

// TODO: responsive
const TaskColumn = ({
    title,
    tasks,
    onTaskClick,
    isFullWidth = false,
}: TaskColumnProps) => {
    return (
        <div
            className={cn(isFullWidth && "w-full")}
        >
            <div
                className={cn(
                    "bg-surface rounded-xl shadow border border-main-border p-4 flex flex-col",
                    isFullWidth ? "col-span-full mb-4" : ""
                )}
            >
                {!isFullWidth && (
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-lg text-main-font">{title}</h2>
                        <Badge variant="outline" className="bg-theme-primary/10 text-main-font border-theme-primary">
                            {tasks.length}
                        </Badge>
                    </div>
                )}

                <div
                    className={cn(
                        "space-y-3",
                        isFullWidth && "grid grid-cols-2 lg:grid-cols-3 gap-4"
                    )}
                >
                    {tasks.length === 0 ? (
                        <div className="text-center text-sm text-muted-foreground">
                            No tasks yet
                        </div>
                    ) : (
                        tasks.map((task) => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                onClick={() => onTaskClick(task._id)}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};


const TaskCard = ({ task, onClick }: { task: TaskType; onClick: () => void }) => {
    return (
        <Card
            onClick={onClick}
            className="cursor-pointer bg-surface border border-main-border rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 hover:border-theme-primary"
        >
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <Badge
                        className={cn(
                            "px-2 py-1 rounded font-semibold text-xs border-none",
                            task.priority === "High"
                                ? "bg-red-600 text-white"
                                : task.priority === "Medium"
                                    ? "bg-orange-400 text-white"
                                    : "bg-slate-400 text-white"
                        )}
                    >
                        {task.priority}
                    </Badge>
                    <div className="flex gap-1">
                        {task.status !== "To Do" && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-6 hover:bg-theme-primary/10"
                                onClick={e => {
                                    e.stopPropagation();
                                    console.log("mark as to do");
                                }}
                                title="Mark as To Do"
                            >
                                <AlertCircle className="size-4 text-theme-primary" />
                                <span className="sr-only">Mark as To Do</span>
                            </Button>
                        )}
                        {task.status !== "In Progress" && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-6 hover:bg-theme-primary/10"
                                onClick={e => {
                                    e.stopPropagation();
                                    console.log("mark as in progress");
                                }}
                                title="Mark as In Progress"
                            >
                                <ClockFadingIcon className="size-4 text-theme-primary" />
                                <span className="sr-only">Mark as In Progress</span>
                            </Button>
                        )}
                        {task.status !== "Done" && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-6 hover:bg-theme-primary/10"
                                onClick={e => {
                                    e.stopPropagation();
                                    console.log("mark as done");
                                }}
                                title="Mark as Done"
                            >
                                <CheckCircleIcon className="size-4 text-theme-primary" />
                                <span className="sr-only">Mark as Done</span>
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <h4 className="font-semibold text-main-font mb-1 line-clamp-1">{task.title}</h4>
                {task.description && (
                    <p className="text-xs text-secondary-font line-clamp-2 mb-2">{task.description}</p>
                )}

                <div className="flex items-center justify-between text-xs mt-2">
                    <div className="flex items-center gap-2">
                        {task.assignees && task.assignees.length > 0 && (
                            <div className="flex -space-x-2">
                                {task.assignees.slice(0, 4).map(member => (
                                    <Avatar
                                        key={member._id}
                                        className="size-7 border-2 border-background bg-deep-surface"
                                        title={member.name}
                                    >
                                        <AvatarImage src={member.profilePicture} />
                                        <AvatarFallback className='bg-surface text-main-font font-bold'>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                ))}
                                {task.assignees.length > 4 && (
                                    <span className="text-xs text-muted-foreground pl-1">
                                        +{task.assignees.length - 4}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    {task.dueDate && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="size-3" />
                            {format(new Date(task.dueDate), "MMM d, yyyy")}
                        </div>
                    )}
                </div>
                {task.subTasks && task.subTasks.length > 0 && (
                    <div className="mt-2 text-xs text-theme-primary font-medium">
                        {task.subTasks.filter(subtask => subtask.completed).length} / {task.subTasks.length} subtasks
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
