import { type FC } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

interface WorkSpaceAvatarProps{
    color: string, 
    name: string
};

const WorkSpaceAvatar:FC<WorkSpaceAvatarProps> = ({color, name}) => {
  return (
    <div  className="size-6 rounded flex justify-center items-center" style={{backgroundColor: color}}>
        <span className="text-xs font-bold text-main-bg">{name.charAt(0).toUpperCase()}</span>
    </div>
  )
}

export default WorkSpaceAvatar