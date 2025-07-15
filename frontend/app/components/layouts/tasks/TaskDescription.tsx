import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateTaskDescriptionMutation } from "@/hooks/useTasks";
import { Edit } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function TaskDescription({ description, taskId }: { description: string, taskId: string }) {
    const [isEditing, setIsEditing] = useState(false);
    const [newDescription, setNewDescription] = useState(description);

    const { mutate, isPending } = useUpdateTaskDescriptionMutation();

    const updateDescription = () => {
        mutate(
            { taskId, description: newDescription },
            {
                onSuccess: () => {
                    setIsEditing(false);
                    toast.success("Description updated successfully");
                },
                onError: (error: any) => {
                    const errorMessage = error.response.data.message;
                    toast.error(errorMessage);
                    console.log(error);
                },
            }
        );
    };


    return (
        <div className="flex items-start gap-3 bg-surface rounded-lg p-4 shadow-sm w-full">
            <div className="flex-1">
            {isEditing ? (
                <Textarea
                className="w-full min-h-[80px] resize-none border-muted bg-surface text-main-font focus:ring-glass-shadow"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                disabled={isPending}
                autoFocus
                />
            ) : (
                <div className="text-base text-muted-foreground whitespace-pre-line">
                {description || <span className="italic text-sm text-secondary-font">No description yet.</span>}
                </div>
            )}
            </div>
            <div className="flex flex-col gap-2">
            {isEditing ? (
                <Button
                className="h-8 px-4 bg-transparent text-main-font hover:text-main-bg hover:bg-theme-tertiary"
                size="sm"
                onClick={updateDescription}
                disabled={isPending}
                variant="default"
                >
                Save
                </Button>
            ) : (
                <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-primary"
                onClick={() => setIsEditing(true)}
                aria-label="Edit description"
                >
                <Edit className="w-4 h-4" />
                </Button>
            )}
            </div>
        </div>
    )
}

export default TaskDescription