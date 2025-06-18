import { useAuthContext } from "@/providers/auth.context";
import { type WorkSpaceType } from "@/types"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuItem } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User2 } from "lucide-react";
import { Link } from "react-router";
import WorkSpaceAvatar from "../common/workSpaceAvatar";
import { Ellipsis } from "lucide-react";


interface HeaderPropsType {
    onWorkSpaceSelected: (workSpace: WorkSpaceType) => void;
    selectedWorkSpace: WorkSpaceType | null;
    onCreatedWorkSpace: () => void;
}

function Header({ onCreatedWorkSpace, onWorkSpaceSelected, selectedWorkSpace }: HeaderPropsType) {
    const { user, logout } = useAuthContext();
    const workspaces: WorkSpaceType[] = [];

    return (
        <div className="sticky top-0 z-50 border-b-2 border-main-border">
            <div className="flex h-14 items-center justify-between px-4 md:px-6 lg:px-8 py-4">
                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="bg-surface text-main-font border-glass-shadow border-2 hover:bg-theme-tertiary hover:text-main-bg font-bold px-2 md:px-4 w-36 md:w-44 overflow-hidden">
                                <div className="h-2 w-2 rounded-full transition-all duration-300 group-hover:scale-[100.8]" style={{ backgroundColor: selectedWorkSpace?.workSpaceColor || "#e5e7eb" }}></div>

                                {selectedWorkSpace ? (<>
                                    {
                                        selectedWorkSpace?.workSpaceColor && <WorkSpaceAvatar color={selectedWorkSpace?.workSpaceColor} name={selectedWorkSpace?.name} />
                                    }
                                    <span className="font-bold text-xs md:text-sm">{selectedWorkSpace?.name.length > 15 ? selectedWorkSpace?.name.slice(0, 15) + "..." : selectedWorkSpace?.name}</span>
                                </>) : (<>
                                    <span className="font-bold text-xs md:text-sm" >Select Workspace</span>
                                </>)}
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="start" className="bg-deep-surface border border-main-border text-main-font w-60" sideOffset={8}>
                            <DropdownMenuLabel className="font-bold">My Workspaces</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-glass-shadow" />
                            <DropdownMenuGroup>
                                {
                                    (!workspaces.length) ? (
                                        <DropdownMenuItem className="pointer-events-none text-disabled focus:bg-deep-surface focus:text-disabled" onClick={() => { return; }}>
                                            Looks empty here...
                                        </DropdownMenuItem>
                                    ) : (
                                        workspaces.map((workspace) => (
                                            <DropdownMenuItem key={workspace._id} className="font-medium cursor-pointer" onClick={() => onWorkSpaceSelected(workspace)}>
                                                {workspace.workSpaceColor && <WorkSpaceAvatar color={workspace.workSpaceColor} name={workspace.name} />}
                                                <span className="ml-2">{workspace.name}</span>
                                            </DropdownMenuItem>
                                        ))
                                    )
                                }
                            </DropdownMenuGroup>

                            <DropdownMenuGroup>
                                {/* For creating workspaces */}
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant={"ghost"} size={"icon"} className="bg-surface hover border-glass-shadow border hover:bg-theme-tertiary">
                        <Bell size={10} />
                    </Button>
                    <div className="h-6 w-[1px] bg-main-border"></div>
                    <div className="flex items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex gap-2 items-center hover:cursor-pointer">
                                    <Avatar className="size-10 border-1 hover:cursor-pointer border-glass-shadow">
                                        <AvatarImage src={user?.profilePicture} />
                                        <AvatarFallback className="bg-surface border border-glass-shadow font-bold">{user?.name.charAt(0).toUpperCase() || <User2 />}</AvatarFallback>
                                    </Avatar>
                                    <div className="sm:flex justify-between w-32 items-center hidden">
                                        <div >
                                            <h1 className="font-bold text-main-font">{((user?.name?.split(" ")[0] ?? "").length < 12) ? user?.name?.split(" ")[0] ?? "" : (user?.name?.split(" ")[0] ?? "") + ".."}</h1>
                                            
                                            <p className="text-[10px] -mt-1 text-secondary-font">Admin Panel</p>
                                        </div>
                                        <p><Ellipsis/></p>
                                    </div>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-deep-surface border border-main-border text-main-font w-44" sideOffset={8}>
                                <DropdownMenuLabel className="font-bold">My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-glass-shadow" />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem className="font-medium cursor-pointer">
                                        <Link to={"/user/profile"} className="text-[15px] w-full">Profile</Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem onClick={logout} className="font-medium cursor-pointer">
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header