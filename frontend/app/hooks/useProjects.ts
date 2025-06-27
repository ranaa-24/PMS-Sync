import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type CreateProjectModalFormType } from "@/components/layouts/project/CreateProjectModal"
import { postData } from "@/lib/api-request-utils"

export const useCreateProjectMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        // data is an object that contains {formData and workspaceId}
        mutationFn: async (data: { formData: CreateProjectModalFormType; workspaceId: string }) =>
            postData(`/projects/${data.workspaceId}/create-project`, data.formData),

        onSuccess: (data: any, variables: { formData: CreateProjectModalFormType; workspaceId: string }) => {
            // Invalidate the useFetchWorkspaceQuery cache for the correct workspaceId
            queryClient.invalidateQueries({
                queryKey: ["workspace", variables.workspaceId]
            });
        }
    });
}