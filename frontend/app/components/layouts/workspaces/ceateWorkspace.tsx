import React from "react"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { workspaceSchema } from "@/lib/schema";
import { z } from 'zod';
import { Dialog, DialogDescription, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateWorkspace } from "@/hooks/useWorkspace";
import { toast } from "sonner";
import { useNavigate } from "react-router";


const themeColors = [
    "#4A90E2", // Soft Blue
    "#FF6B6B", // Warm Coral
    "#2ECC71", // Emerald Green
    "#9B59B6", // Royal Purple
    "#F1C40F", // Amber Yellow
    "#7F8C8D", // Slate Gray
    "#E67E22", // Deep Orange
    "#1ABC9C"  // Teal Blue
];

export type WorkspaceFormType = z.infer<typeof workspaceSchema>;

function CreateWorkspace({ isCreatingWorkSpace, setIsCreatingWorkSpace }: { isCreatingWorkSpace: boolean, setIsCreatingWorkSpace: React.Dispatch<React.SetStateAction<boolean>> }) {

    const navigate = useNavigate();

    const form = useForm<WorkspaceFormType>({
        resolver: zodResolver(workspaceSchema),
        defaultValues: {
            name: "",
            color: themeColors[0],
            description: ""
        }
    });


    const {mutate: createWorkspaceMutation, isPending} = useCreateWorkspace();

    const onFormSubmit = async (data: WorkspaceFormType) => {
        createWorkspaceMutation(data, {         //{message: "", workspace: }
            onSuccess: (data:any) => {
                toast.success(data?.message);
                form.reset();
                setIsCreatingWorkSpace(false);
                navigate(`/workspaces/${data?.workspace._id}`)
            }, 
            onError: (err:any) => {
                toast.error(err.response?.data?.message || "Something went wrong!");
                console.log("Error in createWorkspace FE", err);
            }
        })
    }


    return (
        <Dialog open={isCreatingWorkSpace} onOpenChange={setIsCreatingWorkSpace} modal={true}>
            <DialogContent className=" bg-deep-surface text-main-font border-2 border-main-border">
                <DialogHeader >
                    <DialogTitle>Set Up Your Workspace</DialogTitle>
                    <DialogDescription>
                        Workspaces help you organize your projects and team.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onFormSubmit)}>
                        <div className="space-y-4 py-4 ">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Workspace Name" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} placeholder="Add a short description for your workspace (optional)" rows={4}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="color" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color Identifier</FormLabel>
                                    <FormControl>
                                        <div className="flex gap-2 flex-wrap">
                                            {themeColors.map((color) => (
                                                <div
                                                    key={color}
                                                    className={`size-6 rounded-md cursor-pointer transition-all duration-200 hover:opacity-90 ${
                                                        field.value === color
                                                            ? "ring-2 ring-offset-1 ring-offset-deep-surface ring-theme-tertiary opacity-100"
                                                            : "ring-transparent"
                                                    }`}
                                                    style={{ backgroundColor: color }}
                                                    onClick={() => field.onChange(color)}       // change tthe form state
                                                    aria-label={`Select color ${color}`}
                                                />
                                            ))}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                    <DialogFooter className="mt-4">
                        <Button type="submit" disabled={isPending} className="w-full h-11 font-bold bg-theme-primary text-white hover:bg-theme-primary/85">
                            {isPending ? "Setting Up..." : "Add Workspace"}
                        </Button>
                    </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateWorkspace