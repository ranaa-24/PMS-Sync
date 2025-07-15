import type { StatsCardProps } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

function StatsCard({ data }: { data: StatsCardProps }) {

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="text-main-font bg-theme-tertiary/10 border border-theme-tertiary/80">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalProjects}</div>
          <p className="text-xs text-secondary-font">
            {data.totalProjectInProgress} in progress
          </p>
        </CardContent>
      </Card>
      <Card className="text-main-font bg-theme-tertiary/10 border border-theme-tertiary/80">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalTasks}</div>
          <p className="text-xs text-secondary-font">
            {data.totalTaskCompleted} completed
          </p>
        </CardContent>
      </Card>
      <Card className="text-main-font bg-theme-tertiary/10 border border-theme-tertiary/80">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">To Do</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalTaskToDo}</div>
          <p className="text-xs text-secondary-font">
            Tasks waiting to be done
          </p>
        </CardContent>
      </Card>
      <Card className="text-main-font bg-theme-tertiary/10 border border-theme-tertiary/80">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalTaskInProgress}</div>
          <p className="text-xs text-secondary-font">
            Tasks currently in progress
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default StatsCard