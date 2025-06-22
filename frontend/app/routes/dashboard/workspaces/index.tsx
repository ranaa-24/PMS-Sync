import { type WorkSpaceType } from "@/types"
import { useState } from "react"
import { useFetchWorkspacesQuery } from "@/hooks/useWorkspace"
import Loader from "@/components/common/Loader";
import CreateWorkspace from "@/components/layouts/workspaces/ceateWorkspace";
import { Button } from "@/components/ui/button";
import { PlusSquareIcon } from "lucide-react"
import { EmptyFeild } from "@/components/layouts/workspaces/emptyFeild";
import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import WorkSpaceAvatar from "@/components/common/workSpaceAvatar";
import { format } from "date-fns";
import {Users} from "lucide-react"

export function meta() {
  return [
    { title: "Workspaces - Sync" },
    { name: "description", content: "Manage workspaces" },
  ];
}

function Workspaces() {
    const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

    const { data: workspaces, isLoading } = useFetchWorkspacesQuery() as { data: WorkSpaceType[], isLoading: boolean };

    if (isLoading) {
        return <div className="h-full w-full flex justify-center items-center ">
            <Loader />
        </div>
    }

    return <>
        <div className="space-y-8">
            <div className="flex items-center justify-between">

                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-main-font animate-fade-down">Workspaces</h2>

                <Button className="justify-center text-xs md:text-sm  bg-theme-primary text-main-font border-main-border border-2 hover:bg-theme-primary/80 font-bold" onClick={() => setIsCreatingWorkspace(true)}>
                    <PlusSquareIcon className="font-bold size-5 sm:size-4" />
                    <span className="hidden sm:block">Add Workspace</span>
                </Button>

            </div>


            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 py-4">
                {
                    workspaces.map((ws) => (
                        <WorkspaceCard key={ws._id} workspace={ws} />
                    ))
                }

                {
                    (workspaces.length === 0) && <EmptyFeild
                        title="No Workspaces Yet"
                        description="Start by creating your first workspace to organize your projects, tasks, and team all in one place" buttonText="Add Workspace"
                        className="hidden"     // only for button
                        buttonAction={() => setIsCreatingWorkspace(true)} />
                }
            </div>

        </div>
        {/* invisible modal */}
        <CreateWorkspace isCreatingWorkSpace={isCreatingWorkspace} setIsCreatingWorkSpace={setIsCreatingWorkspace} />
    </>
}



const WorkspaceCard = ({ workspace }: { workspace: WorkSpaceType }) => {
    return (
        <Link to={`/workspaces/${workspace._id}`}>
            <Card
                className={`transition-all duration-300 cursor-pointer bg-surface text-main-font border-2 border-main-border animate-fade-right animate-once animate-duration-[500ms]`}
                style={{
                    boxShadow: `0 0 0 0 transparent`,
                }}
                onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 12px 0 ${workspace.color}22`;
                }}
                onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 0 transparent`;
                }}
            >
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                        <div className="flex gap-3 items-center">
                            <WorkSpaceAvatar color={workspace.color} name={workspace.name} />
                            <div className="flex flex-col ">
                                <CardTitle className="text-md font-semibold text-main-font">{workspace.name}</CardTitle>
                                <span className="text-xs text-secondary-font">{format(workspace.createdAt, "MMM d, yyyy h:mm a")}</span>
                            </div>
                        </div>

                       
                    </div>

                    <CardDescription className="mt-2 overflow-hidden h-10 wrap-break-word">{workspace.description || "Doesn't have a description yet."}</CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="mt-2 flex items-center justify-between">
                        <span
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
                            style={{
                                backgroundColor: `${workspace.color}22`,
                                color: workspace.color,
                                border: `1px solid ${workspace.color}55`,
                            }}
                        >
                            <Users className="size-3" />
                            {workspace.members.length} member{workspace.members.length !== 1 ? "s" : ""}
                        </span>
                        <span className="text-xs text-secondary-font italic">
                            Click to explore details
                        </span>
                    </div>
                </CardContent>
            </Card>

        </Link>
    );
};

export default Workspaces

