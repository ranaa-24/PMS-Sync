import type { ProjectType } from '@/types'
import React from 'react'
import { useSearchParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { getProjectProgress, getTaskStatusColor } from '@/lib/otherUtilities';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { Progress } from '../ui/progress';

function RecentProjects({ data }: { data: ProjectType[] }) {
    const [searchParams] = useSearchParams();
    const workspaceId = searchParams.get("workspaceId");

    return (
        <Card className="bg-surface border-deep-surface shadow-md text-main-font">
            <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {data.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                        No Recent project yet
                    </p>
                ) : (
                    data.map((project) => {
                        const projectProgress = getProjectProgress(project.tasks as any);

                        return (
                            <div key={project._id} className="border border-glass-shadow rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <Link
                                        to={`/workspaces/${workspaceId}/projects/${project._id}`}
                                    >
                                        <h3 className="font-medium hover:underline transition-colors">
                                            {project.title}
                                        </h3>
                                    </Link>

                                    <span
                                        className={cn(
                                            "px-2 py-1 text-xs rounded-full",
                                            getTaskStatusColor(project.status)
                                        )}
                                    >
                                        {project.status}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                                    {project.description}
                                </p>
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                        <span>Progress</span>
                                        <span>{projectProgress}%</span>
                                    </div>

                                    <Progress value={projectProgress} className="h-2" />
                                </div>
                            </div>
                        );
                    })
                )}
            </CardContent>
        </Card>
    )
}

export default RecentProjects