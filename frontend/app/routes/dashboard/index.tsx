import Loader from "@/components/common/Loader";
import RecentProjects from "@/components/dashboard/RecentProjects";
import StatisticsCharts from "@/components/dashboard/StatisticsCharts";
import StatsCard from "@/components/dashboard/StatsCard";
import { UpcomingTasks } from "@/components/dashboard/UpcomingTasks";
import { useGetWorkspaceStatsQuery } from "@/hooks/useWorkspace";
import { useAuthContext } from "@/providers/auth.context"
import type { ProjectStatusData, ProjectType, StatsCardProps, TaskPriorityData, TaskTrendsData, TaskType, WorkspaceProductivityData } from "@/types";
import { useSearchParams } from "react-router";

export function meta() {
  return [
    { title: "Dashboard - Sync" },
    { name: "description", content: "Dashboard" },
  ];
}

function Dashboard() {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");


  const { data, isPending } = useGetWorkspaceStatsQuery(workspaceId!) as {
    data: {
      stats: StatsCardProps;
      taskTrendsData: TaskTrendsData[];
      projectStatusData: ProjectStatusData[];
      taskPriorityData: TaskPriorityData[];
      workspaceProductivityData: WorkspaceProductivityData[];
      upcomingTasks: TaskType[];
      recentProjects: ProjectType[];
    };
    isPending: boolean;
  };

  if (!workspaceId) {
    return <div className="h-full w-full flex flex-col items-center justify-center text-center text-muted-foreground px-4">
      <div className="text-2xl font-semibold mb-2">No Workspace Selected</div>
      <p className="text-sm max-w-md">
        We couldn't load the workspace data. Please select a workspace to view your dashboard.
      </p>
    </div>
  }

  if (!data && !isPending) {
    return <div className='h-full flex items-center justify-center text-secondary-font'>
      Failed to load workspace data, Please select a workspace.
    </div>
  }

  if (isPending) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-8 2xl:space-y-12 pb-3 md:pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <StatsCard data={data.stats} />

      <StatisticsCharts
        stats={data.stats}
        taskTrendsData={data.taskTrendsData}
        projectStatusData={data.projectStatusData}
        taskPriorityData={data.taskPriorityData}
        workspaceProductivityData={data.workspaceProductivityData}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentProjects data={data.recentProjects} />
        <UpcomingTasks data={data.upcomingTasks} />
      </div>
    </div>
  );
}

export default Dashboard