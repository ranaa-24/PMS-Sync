import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUpdateTaskPriorityMutation } from '@/hooks/useTasks';
import type { TaskPriority } from '@/types'
import React from 'react'
import { toast } from 'sonner';

function TaskPrioritySelector({ priority, taskId }: { priority: TaskPriority, taskId: string }) {
    const { mutate, isPending } = useUpdateTaskPriorityMutation();

    const handleStatusChange = (value: string) => {
        mutate(
            { taskId, priority: value as TaskPriority },
            {
                onSuccess: () => {
                    toast.success("Priority updated successfully");
                },
                onError: (error: any) => {
                    const errorMessage = error?.response?.data.message;
                    toast.error(errorMessage);
                    console.log(error);
                },
            }
        );
    };


    return (
        <Select value={priority || ""} onValueChange={handleStatusChange} >
            <SelectTrigger className="w-[180px] border border-main-border" disabled={isPending} >
                <SelectValue placeholder="Priority" />
            </SelectTrigger>

            <SelectContent className="bg-deep-surface border border-glass-shadow text-main-font">
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
            </SelectContent>
        </Select>
    )
}

export default TaskPrioritySelector