import { type WorkSpaceType } from "@/types"
import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import { useSidebarContext } from "@/providers/sidebar-context"
import { Button } from "./button"
import { useLocation, useNavigate } from "react-router"
import { type LucideIcon } from "lucide-react"


export interface NavItemType {
    title: string;
    href: string;
    icon: LucideIcon;
}

interface PropsType extends HTMLAttributes<HTMLElement> {
    items: NavItemType[];
    className?: string;
    currentWorkSpace: WorkSpaceType | null;
}

// ...porop is an REST operator on obj destructuring 
function SideNav({ items, className, currentWorkSpace, ...prop }: PropsType) {   // ...prop is everything else, and since we r extending HTMLAttributes<HTMLElement>, this will include any extra HTML props (like onClick, style, etc.).
    const { isPannelClosed } = useSidebarContext();
    const location = useLocation();
    const navigate = useNavigate();


    return (
        <nav className={cn("flex flex-col gap-y-3", isPannelClosed && "items-center", "items-center md:items-start w-full", className)} {...prop}>
            {
                items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;

                    //if we user clicks on wokspaces section then no isses just move to that page, what if user clicks on other section like, 'members', then we need to  navigate to the members route with the workspace id, so only seleted workspaces memebrs are visoble
                    // Note this is a single handler attached to every sections/nav items
                    const handleClick: any = () => {
                        // clicked on workspace
                        if (item.href === 'workspaces') {
                            navigate("/joo");
                        } else if (currentWorkSpace && currentWorkSpace._id) { // user clicked on other items
                            navigate(`${item.href}/?workspaceId=${currentWorkSpace._id}`)
                        } else {  // if there is no workspaces seleted, navogate and show some selet workspace page 
                            navigate(item.href);
                        }
                    }

                    return <Button title={item.title} key={item.href} variant={isActive ? "outline" : "ghost"} size={isPannelClosed ? "icon" : "default"} className={cn(isPannelClosed ? "justify-center" : "justify-center md:justify-start", isActive && "bg-theme-primary text-main-font font-medium", "w-full")} onClick={handleClick}>
                        <Icon className="size-5" />
                        {isPannelClosed ? <span className="sr-only hidden md:block">{item.title}</span> : <span className="hidden md:block">{item.title}</span>}
                    </Button>
                })
            }
        </nav>
    )
}

export default SideNav