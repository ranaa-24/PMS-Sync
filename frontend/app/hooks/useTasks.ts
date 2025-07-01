import type { CreateTaskFormType } from "@/components/layouts/tasks/createTaskDialog";
import { postData } from "@/lib/api-request-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useCreateTaskMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: {projectId: string; taskData: CreateTaskFormType}) => 
            postData(`/tasks/${data.projectId}/create-task`, data.taskData),
        // tasks/6863df002d67b8af26b8dc96/create-task
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["project", variables.projectId],
            });
        }
    })
}