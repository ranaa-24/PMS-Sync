import { useState } from 'react';
import { useParams } from 'react-router'
import { useFetchWorkspaceQuery } from '@/hooks/useWorkspace';
import {type ProjectType, type WorkSpaceType } from '@/types';
import Loader from '@/components/common/Loader';
import WorkspaceHeader from '@/components/layouts/workspaces/WorkspaceHeader';
import ProjectList from '@/components/layouts/workspaces/ProjectList';
import CreateProjectModal from '@/components/layouts/project/CreateProjectModal';
import DataNotFound from '@/components/common/dataNotFound';

interface ResponseType{
    data: {
        workspace: WorkSpaceType, 
        projects: ProjectType[]
    };

    isLoading: boolean;
}

function WorkspaceDetails() {
    const {workspaceId} = useParams<{workspaceId: string}>();

    const [isCreateProject, setIsCreateProject] = useState<boolean>(false);
    const [isInviteMember, setIsInviteMember] = useState<boolean>(false);

    const {data, isLoading } = useFetchWorkspaceQuery(workspaceId as string) as ResponseType;

    if (!data && !isLoading) {
        return (
            <DataNotFound/>
        );
    }

    if(isLoading){
        return <div className='h-full flex items-center justify-center'>
            <Loader/>
        </div>
    }
    
    if(!workspaceId){
        return <div className='h-full flex items-center justify-center text-secondary-font'>
            No workspace found..
        </div>
    }

    
    
  return (
    <div className='space-y-8'>

        <WorkspaceHeader
            workspace={data?.workspace}
            members={data?.workspace?.members}
            onCreateProject={() => setIsCreateProject(true)} 
            onInviteMember={() => setIsInviteMember(true)}
        />

        <ProjectList
            workspaceId = {workspaceId}
            projects={data?.projects}
            onCreateProject={() => setIsCreateProject(true)}
        />

        {/* create project modal */}
        <CreateProjectModal isOpen={isCreateProject} onOpenChange={setIsCreateProject} workspaceId={workspaceId} workspaceMembers={data?.workspace?.members}/>
    </div>
  )
}

export default WorkspaceDetails