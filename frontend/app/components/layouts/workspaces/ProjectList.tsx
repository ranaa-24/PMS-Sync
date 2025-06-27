import { type ProjectType } from "@/types"
import { EmptyFeild } from "./emptyFeild"
import ProjectCard from "../project/ProjectCard";

interface PropsTypes {
    workspaceId: string,
    projects: ProjectType[],
    onCreateProject: () => void
}

function ProjectList({ workspaceId, projects, onCreateProject }: PropsTypes) {
    return (
        <div>
            <h3 className="text-md md:text-xl font-semibold mb4 ">Everything You're Working On</h3>

            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-3 py-4">
                {
                    projects.length === 0 ?
                        (
                            <EmptyFeild
                                title="No Project yet."
                                description="Start by creating a new project!"
                                buttonText="Craete Project"
                                buttonAction={onCreateProject}
                                className="bg-surface"
                            />

                        )
                        :
                        (
                            projects.map((project) => {
                                const projectProgress = 0;
                                return (
                                    <ProjectCard key={project._id} project={project} workspaceId={workspaceId} progress={projectProgress} />
                                )
                            })
                        )
                }
            </div>
        </div>
    )
}




export default ProjectList