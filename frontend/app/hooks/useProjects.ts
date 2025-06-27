import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type CreateProjectModalFormType } from "@/components/layouts/project/CreateProjectModal"
import { postData } from "@/lib/api-request-utils"

export const useCreateProject = async() => {
    const qc = useQueryClient();

    return useMutation({
        // data is a obj that contains {formData and workspaceId}
        mutationFn: async (data: {formData: CreateProjectModalFormType, workspaceId: string}) => postData(`/projects/${data.workspaceId}/create-project`, data.formData), 

        onSuccess: (data:any) => {
            //invalidatinf the GET `/workspaces/${workspaceId}/projects` in useFetchWorkspaceQuery so when ever a new projects is get created we refetch
            qc.invalidateQueries({
                queryKey: ["workspace", data.workspace]
            })
        } 

    })
}