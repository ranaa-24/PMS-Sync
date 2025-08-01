import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useAddSubTaskMutation, useUpdateSubTaskMutation } from '@/hooks/useTasks';
import { cn } from '@/lib/utils';
import type { subtaskType } from '@/types'
import React, { useState } from 'react'
import { toast } from 'sonner';

function SubTasksDetails({ subTasks, taskId }: { subTasks: subtaskType[], taskId: string }) {

    const [newSubTask, setNewSubTask] = useState("");
    const { mutate: addSubTask, isPending } = useAddSubTaskMutation();
    const { mutate: updateSubTask, isPending: isUpdating } = useUpdateSubTaskMutation();

    const handleToggleTask = (subTaskId: string, checked: boolean) => {
        updateSubTask(
            { taskId, subTaskId, completed: checked },
            {
                onSuccess: () => {
                    toast.success("Sub task updated successfully");
                },
                onError: (error: any) => {
                    const errMessage = error.response.data.message;
                    console.log(error);
                    toast.error(errMessage);
                },
            }
        );
    };

    const handleAddSubTask = () => {
        addSubTask(
            { taskId, title: newSubTask },
            {
                onSuccess: () => {
                    setNewSubTask("");
                    toast.success("Sub task added successfully");
                },
                onError: (error: any) => {
                    const errMessage = error.response.data.message;
                    console.log(error);
                    toast.error(errMessage);
                },
            }
        );
    };

    return (
        <div className="mb-6">
            <h3 className="text-sm font-medium text-secondary-font my-3">
                Sub Tasks
            </h3>

            <div className="space-y-2 mb-4">
                {subTasks.length > 0 ? (
                    subTasks.map((subTask) => (
                        <div key={subTask._id} className="flex items-center space-x-2">
                            <Checkbox
                                id={subTask._id}
                                checked={subTask.completed}
                                onCheckedChange={(checked) =>
                                    handleToggleTask(subTask._id, !!checked)
                                }
                                disabled={isUpdating}
                            />

                            <label
                                className={cn(
                                    "text-sm",
                                    subTask.completed ? "line-through text-muted-foreground" : ""
                                )}
                            >
                                {subTask.title}
                            </label>
                        </div>
                    ))
                ) : (
                    <div className="text-sm text-secondary-font italic">No sub tasks</div>
                )}
            </div>

            <div className="flex ">
                <Input
                    placeholder="Add a sub task"
                    value={newSubTask}
                    onChange={(e) => setNewSubTask(e.target.value)}
                    className="mr-2 border border-main-border"
                    disabled={isPending}
                />

                <Button
                    className='bg-theme-tertiary text-main-bg hover:bg-theme-tertiary/80'
                    onClick={handleAddSubTask}
                    disabled={isPending || newSubTask.length === 0}
                >
                    Add
                </Button>
            </div>
        </div>

    )
}

export default SubTasksDetails