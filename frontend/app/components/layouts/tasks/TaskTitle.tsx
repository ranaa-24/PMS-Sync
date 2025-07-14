import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateTaskTitleMutation } from "@/hooks/useTasks";
import { Edit } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const TaskTitle = ({
  title,
  taskId,
}: {
  title: string;
  taskId: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const { mutate, isPending } = useUpdateTaskTitleMutation();


  const updateTitle = () => {
    mutate(
      { taskId, title: newTitle },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success("Title updated successfully");
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data.message;
          toast.error(errorMessage);
          console.log("Error updating title",error);
        },
      }
    );
  };

  return (
    <div className="flex items-center gap-3 py-2">
      {isEditing ? (
        <>
          <Input
            className="text-lg font-medium flex-1 border-primary focus:ring-primary/40"
            value={newTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTitle(e.target.value)}
            disabled={isPending}
            autoFocus
          />
          <Button
            variant="ghost"
            size="sm"
            className="ml-2"
            onClick={updateTitle}
            disabled={isPending || !newTitle.trim()}
          >
            Save
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="ml-1"
            onClick={() => {
              setIsEditing(false);
              setNewTitle(title);
            }}
            disabled={isPending}
          >
            Cancel
          </Button>
        </>
      ) : (
        <>
          <h2 className="text-lg font-semibold flex-1 truncate">{title}</h2>
          <Button
            variant="ghost"
            size="icon"
            className="ml-2"
            onClick={() => setIsEditing(true)}
            aria-label="Edit title"
          >
            <Edit className="w-4 h-4 text-muted-foreground hover:text-main-bg transition-colors" />
          </Button>
        </>
      )}
    </div>
  );
};

export default TaskTitle