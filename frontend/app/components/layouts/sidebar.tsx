import { type WorkSpaceType } from "@/types"
import { useAuthContext } from "@/providers/auth.context"
import { LayoutDashboard, WorkflowIcon, ListChecksIcon, UsersIcon, CheckSquareIcon, Settings2Icon } from 'lucide-react'
import { cn } from "@/lib/utils";
import { Link } from "react-router";
import Logo from "../ui/logo";
import { useSidebarContext } from "@/providers/sidebar-context";
import { ScrollArea } from "../ui/scroll-area";
import SideNav, { type NavItemType } from "../ui/sideNavBarItems";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";


function SidebarComponent({ currentWorkSpace }: { currentWorkSpace: WorkSpaceType | null }) {
    const { user, logout } = useAuthContext();
    const { isPannelClosed } = useSidebarContext();

    const sidebarItems = [
        {
            title: "Dashboard",
            href: '/dashboard',
            icon: LayoutDashboard,
        },
        {
            title: "Workspaces",
            href: '/workspaces',
            icon: WorkflowIcon,
        },
        {
            title: "My Tasks",
            href: 'my-tasks',
            icon: ListChecksIcon,
        },
        {
            title: 'Members',
            href: 'members',
            icon: UsersIcon,
        },
        {
            title: "Completed",
            href: 'completed',
            icon: CheckSquareIcon
        },
        {
            title: "Settings",
            href: 'settings',
            icon: Settings2Icon,
        }
    ]

    return (
        <div className={cn("px-2 md:px-4 bg-surface flex flex-col border-r border-main-border transition-all duration-300", isPannelClosed ? "w-16 md:w-[80px]" : "w-16 md:w-[200px] lg:md:w-[240px]")}>

                <div className={cn("flex items-center",isPannelClosed ? "justify-center" : "justify-center md:justify-start" ,"h-14 border-b-2 border-main-border")}>
                    <Link to={'/dashboard'} >
                        <div className="flex items-center justify-center w-full ">
                            <Logo />
                        </div>
                    </Link>
                </div>

            <ScrollArea className="flex-1 py-6 items-center ">
                <SideNav
                    items={sidebarItems as NavItemType[]}
                    className={cn(isPannelClosed && "items-center space-y-1")}
                    currentWorkSpace={currentWorkSpace}
                />
            </ScrollArea>

            <div>
                <Button variant={"ghost"} onClick={logout}>
                    <LogOut />
                    <span className="hidden md:block">Logout</span>
                </Button>
            </div>
        </div>
    )
}

export default SidebarComponent