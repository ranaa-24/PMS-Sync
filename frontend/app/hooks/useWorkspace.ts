import { useMutation } from "@tanstack/react-query"
import { type WorkspaceFormType } from "@/components/layouts/workspaces/ceateWorkspace"
import { postData } from "@/lib/api-request-utils"

export const useCreateWorkspace = () => {
    return useMutation({
        mutationFn: async(data: WorkspaceFormType) => postData('/workspaces', data),
    })
}