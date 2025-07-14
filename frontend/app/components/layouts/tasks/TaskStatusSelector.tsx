import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpdateTaskStatusMutation } from "@/hooks/useTasks";
import { type TaskStatus } from "@/types"
import { toast } from "sonner";

function TaskStatusSelector({ status, taskId }: { status: TaskStatus, taskId: string }) {

    const { mutate, isPending } = useUpdateTaskStatusMutation();

    const handleStatusChange = (value: string) => {
        mutate(
            { taskId, status: value as TaskStatus },
            {
                onSuccess: () => {
                    toast.success("Status updated successfully");
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
        <Select value={status || ""} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px] border border-main-border" disabled={isPending}>
                <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent className="bg-deep-surface border border-glass-shadow text-main-font">
                <SelectItem value="To Do">To Do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
            </SelectContent>
        </Select>
    );
}

export default TaskStatusSelector