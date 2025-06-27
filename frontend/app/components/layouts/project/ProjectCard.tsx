import type { ProjectType } from "@/types"

interface PropsTypes{
    project: ProjectType, 
    workspaceId: string, 
    progress: number
}


function ProjectCard({project, progress, workspaceId} : PropsTypes) {
  return (
    <div>ProjectCard</div>
  )
}

export default ProjectCard