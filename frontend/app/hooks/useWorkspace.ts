import { useMutation, useQuery } from "@tanstack/react-query"
import { type WorkspaceFormType } from "@/components/layouts/workspaces/ceateWorkspace"
import { getData, postData } from "@/lib/api-request-utils"

export const useCreateWorkspace = () => {
    return useMutation({
        mutationFn: async(data: WorkspaceFormType) => postData('/workspaces', data),
    })
}

export const useFetchWorkspacesQuery = () => {
    return useQuery({
        queryKey:["workspaces"], 
        queryFn: async () => getData("/workspaces"),

    })
}