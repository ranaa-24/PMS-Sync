import type { CreateTaskFormType } from "@/components/layouts/tasks/createTaskDialog";
import { getData, postData, updateData } from "@/lib/api-request-utils";
import type { TaskStatus } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


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

export const useTaskByIdQuery = (taskId: string) => {
    return useQuery({
        queryKey: ["task", taskId], 
        queryFn: () => getData(`/tasks/${taskId}`)
    })
}

export const useUpdateTaskTitleMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { taskId: string; title: string }) => updateData(`/tasks/${data.taskId}/title`, {title : data.title}),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["task", variables.taskId],
            });
        }
    })
}

export const useUpdateTaskStatusMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: {taskId: string, status: TaskStatus}) => updateData(`/tasks/${data.taskId}/status`, {status: data.status}),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["task", variables.taskId]
            })
        }
    })
}

export const useUpdateTaskDescriptionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { taskId: string; description: string }) =>
      updateData(`/tasks/${data.taskId}/description`, {
        description: data.description,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["task", variables.taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["task-activity", variables.taskId],
      });
    },
  });
};