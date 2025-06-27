import { type Dispatch, type SetStateAction } from 'react'
import { type WorkSpaceMemberType } from '@/types'
import { z } from 'zod';
import { ProjectSchma } from '@/lib/schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProjectStatus } from '@/types';
import { DialogContent, Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { CalendarIcon } from "lucide-react"
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { useCreateProjectMutation } from '@/hooks/useProjects';
import { toast } from 'sonner';


interface PropsTypes {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  workspaceId: string;
  workspaceMembers: WorkSpaceMemberType[];
}

export type CreateProjectModalFormType = z.infer<typeof ProjectSchma>;

function CreateProjectModal({ isOpen, onOpenChange, workspaceId, workspaceMembers }: PropsTypes) {

  const form = useForm<CreateProjectModalFormType>({
    resolver: zodResolver(ProjectSchma),
    defaultValues: {
      title: '',
      description: '',
      status: ProjectStatus.PLANNING,
      startDate: '',
      dueDate: '',
      members: [],
      tags: undefined,
    }
  });

  const { mutate: mutateProjects, isPending } = useCreateProjectMutation();

  const onSubmit = (data: CreateProjectModalFormType) => {
    if (!workspaceId) return;
    mutateProjects({ formData: data, workspaceId: workspaceId }, {
      onSuccess: () => {
        toast.success("Project created successfully", {
          description: "You can now manage your project.",
        });
        form.reset();
        onOpenChange(false);
      },

      onError: (error: any) => {
        toast.error("Failed to create project", {
          description: error?.response?.data?.message || "Something went wrong",
        });

        console.log("Error in CreateProjectModal onSubmit:", error);
      }

    })
  }


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange} modal={true}>
      <DialogContent className=" bg-deep-surface text-main-font border-2 border-main-border">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Fill in the information below to start managing your project right away.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Project title' />
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
                    <Textarea {...field} placeholder="Add a short description for your project (optional)" rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Set Status</FormLabel>
                  <FormControl >
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full cursor-pointer">
                        <SelectValue placeholder="Select the Current Status" />
                      </SelectTrigger>
                      <SelectContent className='bg-deep-surface border border-main-border text-main-font'>
                        {
                          // array of values of the enum obj.. ["pllannig", "inprogress"]
                          Object.values(ProjectStatus).map((statusStr) => (
                            <SelectItem key={statusStr} value={statusStr} className='cursor-pointer border-b border-b-glass-shadow'>
                              {statusStr}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid sm:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Popover modal={true}>
                        <PopoverTrigger asChild>
                          <Button className={cn('border border-main-font hover:brightness-125 w-full', !field.value ? "text-secondary-font" : "")}>
                            <CalendarIcon className='size-4 mr-1 md:mr-2' />
                            {field.value ? format(new Date(field.value), "EEE, MMM do, yyyy") : <span>Pick a Date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          {/* getting date as a string, cz new Date() / react daypicker returns a date object.. and the good thing is that we can convert this IOS strong to a date object using new Date(str) */}
                          <Calendar mode='single' selected={field.value ? new Date(field.value) : undefined} onSelect={
                            (date) => {
                              field.onChange(date?.toISOString() || undefined)
                            }
                          } />

                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Popover modal={true}>
                        <PopoverTrigger asChild>
                          <Button className={cn('border border-main-font hover:brightness-125 w-full', !field.value ? "text-secondary-font" : "")}>
                            <CalendarIcon className='size-4 mr-1 md:mr-2' />
                            {field.value ? format(new Date(field.value), "EEE, MMM do, yyyy") : <span>Pick a Date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          {/* getting date as a string, cz new Date() / react daypicker returns a date object.. and the good thing is that we can convert this IOS strong to a date object using new Date(str) */}
                          <Calendar mode='single' selected={field.value ? new Date(field.value) : undefined} onSelect={
                            (date) => {
                              field.onChange(date?.toISOString() || undefined)
                            }
                          } />

                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


            </div>

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Add tags (comma separated)' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="members"
              render={({ field }) => {
                const selectedMembers = field.value || [];

                return (
                  <FormItem>
                    <FormLabel>Add Members</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button className='border border-main-font hover:brightness-125 w-full'>
                            {
                              selectedMembers.length === 0 ? (
                                <span className='text-secondary-font'>Select Members</span>
                              ) :
                                (
                                  selectedMembers.length < 3 ? (
                                    selectedMembers.map((m) => {
                                      const member = workspaceMembers.find((workspaceMember) => workspaceMember.user._id === m.user)

                                      return `${member?.user?.name} (${member?.role})`
                                    })
                                  ) : (
                                    `${selectedMembers.length} Members Selected`
                                  )
                                )
                            }
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className='max-w-sm overflow-y-auto bg-deep-surface text-main-font border border-main-border' align='start' >
                          <div className='flex flex-col gap-2'>
                            {
                              workspaceMembers.map((member) => {
                                const selectedMember = selectedMembers.find((m) => member.user._id === m.user);

                                return <div key={member._id} className="flex items-center gap-2 p-2 rounded ">
                                  <Checkbox
                                    checked={!!selectedMember}  // reuire a bool value thats why !!
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        // if the current checkbx is checked then change the form state, by adding a new member 
                                        field.onChange([...selectedMembers, { user: member.user._id, role: "contributor" }]);
                                      } else {
                                        // if the current chkbox is not seleted, remove from the feild value
                                        field.onChange(selectedMembers.filter((m) => m.user !== member.user._id));
                                      }
                                    }}
                                    id={`member - ${member.user._id}`}
                                  />

                                  <span className='truncate flex-1'>{member?.user.name}</span>

                                  {
                                    selectedMember && (
                                      <Select value={selectedMember.role} onValueChange={(role) => {
                                        field.onChange(selectedMembers.map((m) => m.user === member.user._id ? { ...m, role: role as "manager" | "contributor" | "viewer" } : m))
                                      }}>

                                        <SelectTrigger>
                                          <SelectValue placeholder="Set Role" />
                                        </SelectTrigger>

                                        <SelectContent className="bg-deep-surface border border-main-border text-main-font">
                                          <SelectItem value='manager'>Manager</SelectItem>
                                          <SelectItem value='contributor'>Contributor</SelectItem>
                                          <SelectItem value='viewer'>Viewer</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    )
                                  }
                                </div>
                              })
                            }
                          </div>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />

            <DialogFooter>
              <Button type='submit' disabled={isPending} className="w-full h-11 font-bold bg-theme-primary text-white hover:bg-theme-primary/85">
                {isPending ? "Creating.." : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateProjectModal
