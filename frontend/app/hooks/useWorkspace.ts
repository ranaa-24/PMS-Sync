import { useMutation, useQuery } from "@tanstack/react-query";
import { type WorkspaceFormType } from "@/components/layouts/workspaces/ceateWorkspace";
import { getData, postData } from "@/lib/api-request-utils";

export const useCreateWorkspace = () => {
  return useMutation({
    mutationFn: async (data: WorkspaceFormType) =>
      postData("/workspaces", data),
  });
};

// fetches all the wp where the user is member, res: {workspaces}
export const useFetchWorkspacesQuery = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => getData("/workspaces"),
  });
};

// get all the projects of the current workspace res: {workspace, projects}
export const useFetchWorkspaceQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => getData(`/workspaces/${workspaceId}/projects`),
  });
};

export const useGetWorkspaceStatsQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceId, "stats"],
    queryFn: async () => getData(`/workspaces/${workspaceId}/stats`),
  });
};

export const useGetWorkspaceDetailsQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceId, "details"],
    queryFn: async () => getData(`/workspaces/${workspaceId}`),
  });
};

export const useInviteMemberMutation = () => {
  return useMutation({
    mutationFn: (data: { email: string; role: string; workspaceId: string }) =>
      postData(`/workspaces/${data.workspaceId}/invite-member`, data),
  });
};

export const useAcceptInviteByTokenMutation = () => {
  return useMutation({
    mutationFn: (token: string) =>
      postData(`/workspaces/accept-invite-token`, {
        token,
      }),
  });
};

export const useAcceptGenerateInviteMutation = () => {
  return useMutation({
    mutationFn: (workspaceId: string) =>
      postData(`/workspaces/${workspaceId}/accept-generate-invite`, {}),
  });
};
