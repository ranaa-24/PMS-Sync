import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useUpdateTaskAssigneesMutation } from '@/hooks/useTasks';
import type { TaskType, User, ProjectMemberType } from '@/types'
import { useState } from 'react';
import { toast } from 'sonner';

function TaskAssigneesSelector({ task, assignees, projectMembers }: { task: TaskType, assignees: User[], projectMembers: ProjectMemberType[] }) {
    const [selectedIds, setSelectedIds] = useState<string[]>(
        assignees.map((assignee) => assignee._id)
    );
    const [dropDownOpen, setDropDownOpen] = useState(false);
    const { mutate, isPending } = useUpdateTaskAssigneesMutation();

    const handleSelectAll = () => {
        const allIds = projectMembers.map((m) => m.user._id);

        setSelectedIds(allIds);
    };

    const handleUnSelectAll = () => {
        setSelectedIds([]);
    };

    const handleSelect = (id: string) => {
        let newSelected: string[] = [];

        if (selectedIds.includes(id)) {
            newSelected = selectedIds.filter((sid) => sid !== id);
        } else {
            newSelected = [...selectedIds, id];
        }

        setSelectedIds(newSelected);
    };

    const handleSave = () => {
        mutate(
            {
                taskId: task._id,
                assignees: selectedIds,
            },
            {
                onSuccess: () => {
                    setDropDownOpen(false);
                    toast.success("Assignees updated successfully");
                },
                onError: (error: any) => {
                    const errMessage =
                        error.response?.data?.message || "Failed to update assignees";
                    toast.error(errMessage);
                    console.log(error);
                },
            }
        );
    };

    return (
        <div className="mb-6">
            <h3 className="text-sm font-medium text-secondary-font mb-2">
                Assignees
            </h3>

            <div className="flex flex-wrap gap-2 mb-2">
                {selectedIds.length === 0 ? (
                    <span className="text-xs text-secondary-font">Unassigned</span>
                ) : (
                    projectMembers
                        .filter((member) => selectedIds.includes(member.user._id))
                        .map((m) => (
                            <div
                                key={m.user._id}
                                className="flex items-center gap-2 bg-surface border border-theme-tertiary/20 rounded-lg px-3 py-1 shadow-sm"
                            >
                                <Avatar className="size-6 border-1 border-glass-shadow">
                                    <AvatarImage src={m.user.profilePicture} />
                                    <AvatarFallback className="bg-theme-tertiary text-main-bg border border-glass-shadow font-bold text-sm">
                                        {m.user.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium text-main-font">
                                    {m.user.name}
                                </span>
                            </div>
                        ))
                )}
            </div>

            {/* dropdown */}
            <div className="relative">
                <button
                    className="text-sm text-muted-foreground w-full border border-theme-tertiary/20 cursor-pointer rounded-lg px-3 py-2 text-left bg-surface"
                    onClick={() => setDropDownOpen(!dropDownOpen)}
                >
                    {selectedIds.length === 0
                        ? "Select assignees"
                        : `${selectedIds.length} selected`}
                </button>

                {dropDownOpen && (
                    <div className=" absolute z-10 mt-1 w-full bg-deep-surface  rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        <div className="flex justify-between px-2 py-1">
                            <button
                                className="text-xs text-blue-600 cursor-pointer hover:underline"
                                onClick={handleSelectAll}
                            >
                                Select all
                            </button>
                            <button
                                className="text-xs text-red-600 cursor-pointer hover:underline"
                                onClick={handleUnSelectAll}
                            >
                                Unselect all
                            </button>
                        </div>

                        {projectMembers.map((m) => (
                            <label
                                className="flex items-center px-3 py-2 cursor-pointer hover:bg-theme-tertiary/10  transition-colors duration-300"
                                key={m.user._id}
                            >
                                <Checkbox
                                    checked={selectedIds.includes(m.user._id)}
                                    onCheckedChange={() => handleSelect(m.user._id)}
                                    className="mr-2"
                                />

                                <Avatar className="size-6 mr-2 border border-main-bg">
                                    <AvatarImage src={m.user.profilePicture} />
                                    <AvatarFallback className="bg-theme-tertiary text-main-bg border border-glass-shadow font-bold text-sm">{m.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>

                                <span>{m.user.name}</span>
                            </label>
                        ))}

                        <div className="flex justify-end gap-2 px-3 py-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-secondary-font hover:bg-theme-tertiary/10 hover:text-main-font"
                                onClick={() => setDropDownOpen(false)}
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                className="bg-theme-primary text-main-bg hover:bg-theme-primary/90 font-medium"
                                disabled={isPending}
                                onClick={handleSave}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TaskAssigneesSelector