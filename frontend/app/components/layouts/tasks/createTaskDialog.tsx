import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTaskMutation } from "@/hooks/useTasks";
import { CreateTaskFormSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
import type { ProjectMemberRole, User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

interface PropsTypes {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string;
    projectMembers: { user: User, role: ProjectMemberRole }[];
}

export type CreateTaskFormType = z.infer<typeof CreateTaskFormSchema>;


function CreateTaskDialog({ open, onOpenChange, projectId, projectMembers }: PropsTypes) {

    const form = useForm<CreateTaskFormType>({
        resolver: zodResolver(CreateTaskFormSchema),
        defaultValues: {
            title: "",
            description: "",
            status: "To Do",
            priority: "Medium",
            dueDate: "",
            assignees: [],
        },
    });

    const { mutate, isPending } = useCreateTaskMutation();

    const onSubmit = (values: CreateTaskFormType) => {
        mutate(
            {
                projectId,
                taskData: values,
            },
            {
                onSuccess: () => {
                    toast.success("Task created successfully");
                    form.reset();
                    onOpenChange(false);
                },
                onError: (error: any) => {
                    const errorMessage = error?.response?.data?.message || "Something went wrong. Please try again.";
                    toast.error(errorMessage);
                    console.log(error);
                },
            }
        );
    };



    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className=" bg-deep-surface text-main-font border-2 border-main-border">
                <DialogHeader>
                    <DialogTitle>Create Task</DialogTitle>
                    <DialogDescription>
                        Create a new project to organize your tasks and collaborate with your team.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid gap-4 py-2">
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter task title" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    placeholder="Enter task description (optional)"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Status</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        <FormItem>
                                                            <FormControl>
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Select status" />
                                                                </SelectTrigger>
                                                            </FormControl>

                                                            <SelectContent className='bg-deep-surface border border-main-border text-main-font'>
                                                                <SelectItem value="To Do">To Do</SelectItem>
                                                                <SelectItem value="In Progress">
                                                                    In Progress
                                                                </SelectItem>
                                                                <SelectItem value="Done">Done</SelectItem>
                                                            </SelectContent>
                                                        </FormItem>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="priority"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Priority</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        <FormItem>
                                                            <FormControl>
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Select priority" />
                                                                </SelectTrigger>
                                                            </FormControl>

                                                            <SelectContent className='bg-deep-surface border border-main-border text-main-font'>
                                                                <SelectItem value="Low">Low</SelectItem>
                                                                <SelectItem value="Medium">Medium</SelectItem>
                                                                <SelectItem value="High">High</SelectItem>
                                                            </SelectContent>
                                                        </FormItem>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="dueDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Due Date</FormLabel>
                                            <FormControl>
                                                <Popover modal={true}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            className={cn('border border-main-font hover:brightness-125 w-full', !field.value ? "text-secondary-font" : "")}
                                                        >
                                                            <CalendarIcon className='size-4 mr-1 md:mr-2' />
                                                            {field.value ? format(new Date(field.value), "EEE, MMM do, yyyy") : <span>Pick a Date</span>}
                                                        </Button>
                                                    </PopoverTrigger>

                                                    <PopoverContent>
                                                        <Calendar
                                                            mode="single"
                                                            selected={
                                                                field.value ? new Date(field.value) : undefined
                                                            }
                                                            onSelect={(date) => {
                                                                field.onChange(
                                                                    date?.toISOString() || undefined
                                                                );
                                                            }}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="assignees"
                                    render={({ field }) => {
                                        const selectedMembers = field.value || [];

                                        return (
                                            <FormItem>
                                                <FormLabel>Assignees</FormLabel>
                                                <FormControl>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                // className="w-full justify-start text-left font-normal min-h-11"
                                                                className="border border-main-font hover:brightness-125 w-full"
                                                            >
                                                                {selectedMembers.length === 0 ? (
                                                                    <span className="text-secondary-font">
                                                                        Select assignees
                                                                    </span>
                                                                ) : selectedMembers.length <= 2 ? (
                                                                    selectedMembers
                                                                        .map((m) => {
                                                                            const member = projectMembers.find(
                                                                                (wm) => wm.user._id === m
                                                                            );
                                                                            return `${member?.user.name}`;
                                                                        })
                                                                        .join(", ")
                                                                ) : (
                                                                    `${selectedMembers.length} assignees selected`
                                                                )}
                                                            </Button>
                                                        </PopoverTrigger>

                                                        <PopoverContent
                                                            className='max-w-sm overflow-y-auto bg-deep-surface text-main-font border border-main-border' align='start'
                                                        >
                                                            <div className="flex flex-col gap-2">
                                                                {projectMembers.map((member) => {
                                                                    const selectedMember = selectedMembers.find(
                                                                        (m) => m === member.user?._id
                                                                    );
                                                                    return (
                                                                        <div
                                                                            key={member.user._id}
                                                                            className="flex items-center gap-2 p-2 rounded"
                                                                        >
                                                                            <Checkbox
                                                                                checked={!!selectedMember}
                                                                                onCheckedChange={(checked) => {
                                                                                    if (checked) {
                                                                                        field.onChange([
                                                                                            ...selectedMembers,

                                                                                            member.user._id,
                                                                                        ]);
                                                                                    } else {
                                                                                        field.onChange(
                                                                                            selectedMembers.filter(
                                                                                                (m) => m !== member.user._id
                                                                                            )
                                                                                        );
                                                                                    }
                                                                                }}
                                                                                id={`member-${member.user._id}`}
                                                                            />
                                                                            <span className="truncate flex-1">
                                                                                {member.user.name}
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type='submit' disabled={isPending} className="w-full h-11 font-bold bg-theme-primary text-white hover:bg-theme-primary/85">
                                {isPending ? "Creating.." : "Create Task"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateTaskDialog