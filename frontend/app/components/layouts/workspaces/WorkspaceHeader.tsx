import WorkSpaceAvatar from '@/components/common/workSpaceAvatar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import type { WorkSpaceType, WorkSpaceMemberType } from '@/types'
import { PlusSquareIcon, User2 } from 'lucide-react'
import { Link2Icon } from "lucide-react"

interface PropsType {
  workspace: WorkSpaceType,
  members: WorkSpaceMemberType[],
  onCreateProject: () => void,
  onInviteMember: () => void
}

function WorkspaceHeader({ workspace, members, onCreateProject, onInviteMember }: PropsType) {

  return (
    <div className="space-y-3">

      <div className="space-y-3">

        <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            {workspace.color && (
              <WorkSpaceAvatar color={workspace.color} name={workspace.name} />
            )}
            <div></div>
            <h2 className='text-2xl md:text-3xl text-main-font font-bold '>
              {workspace.name}
            </h2>
          </div>

          <div className='flex justify-center gap-3 items-center md:justify-start mb-3 md:mb-0 '>
            <Button className="justify-center text-xs md:text-sm  bg-deep-surface text-main-font border-main-border border-2 hover:brightness-110 font-bold" onClick={onInviteMember}>
              <Link2Icon className="font-bold size-5 sm:size-4" />
              <span>Invite Member</span>
            </Button>

            <Button className="justify-center text-xs md:text-sm  bg-theme-primary text-main-font border-main-border border-2 hover:bg-theme-primary/80 font-bold" onClick={onCreateProject}>
              <PlusSquareIcon className="font-bold size-5 sm:size-4" />
              <span>Create Project</span>
            </Button>
          </div>
        </div>

        {workspace.description && <p className='text-sm md:text-base text-secondary-font break-all  max-h-14'>{workspace.description}</p>}
      </div>

      {
        members.length > 0 && <div className='flex items-center gap-2'>
          <span className='text-sm text-secondary-font'>Members </span>
          <div className='flex -space-x-2'>
            {
              members.map(m => (                
                <Avatar key={m._id} title={m?.user?.name} className="size-8 border-1 hover:cursor-pointer border-glass-shadow">
                  <AvatarImage src={m?.user?.profilePicture} />
                  <AvatarFallback className="bg-surface border border-glass-shadow font-bold">{m.user?.name.charAt(0).toUpperCase() || <User2 />}</AvatarFallback>
                </Avatar>
              ))
            }
          </div>
        </div>
      }

    </div>
  )
}

export default WorkspaceHeader