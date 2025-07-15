import type { ProjectStatusData, StatsCardProps, TaskPriorityData, TaskTrendsData, WorkspaceProductivityData } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChartBarBig, ChartLine, ChartPie } from "lucide-react";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, XAxis, YAxis } from "recharts";

interface StatisticsChartsProps {
    stats: StatsCardProps;
    taskTrendsData: TaskTrendsData[];
    projectStatusData: ProjectStatusData[];
    taskPriorityData: TaskPriorityData[];
    workspaceProductivityData: WorkspaceProductivityData[];
}

function StatisticsCharts({
    stats,
    taskTrendsData,
    projectStatusData,
    taskPriorityData,
    workspaceProductivityData,
}: StatisticsChartsProps) {


    return (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8 text-main-font ">
            <Card className="lg:col-span-2 bg-surface border-deep-surface shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-0.5">
                        <CardTitle className="text-base font-semibold text-main-font">Task Trends</CardTitle>
                        <CardDescription className="text-muted-foreground">Shows how tasks change status each day</CardDescription>
                    </div>
                    <ChartLine className="size-5 text-accent" />
                </CardHeader>
                <CardContent className="w-full overflow-x-auto md:overflow-x-hidden">
                    <div className="min-w-[350px]">
                        <ChartContainer
                            className="h-[300px] w-full"
                            config={{
                                completed: { color: "#10b981" }, // green
                                inProgress: { color: "#3b82f6" }, // blue
                                todo: { color: "#f59e0b" }, // yellow
                            }}
                        >
                            <LineChart data={taskTrendsData}>
                                <XAxis
                                    dataKey="name"
                                    stroke="#d1d5db"
                                    fontSize={13}
                                    tickLine={false}
                                    axisLine={false}
                                    padding={"gap"}
                                />
                                <YAxis
                                    stroke="#d1d5db"
                                    fontSize={13}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="#e5e7eb" />
                                <ChartTooltip
                                    contentStyle={{
                                        background: "#18181b",
                                        border: "none",
                                        borderRadius: "8px",
                                        color: "#f3f4f6",
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="completed"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    dot={{ r: 5, fill: "#10b981" }}
                                    name="Completed"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="inProgress"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{ r: 5, fill: "#3b82f6" }}
                                    name="In Progress"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="todo"
                                    stroke="#f59e0b"
                                    strokeWidth={3}
                                    dot={{ r: 5, fill: "#f59e0b" }}
                                    name="To Do"
                                />
                                <ChartLegend content={<ChartLegendContent />} />
                            </LineChart>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-surface border-deep-surface shadow-md text-main-font">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-0.5">
                        <CardTitle className="text-base font-medium">
                            Project Status
                        </CardTitle>
                        <CardDescription>Project status breakdown</CardDescription>
                    </div>

                    <ChartPie className="size-5 text-muted-foreground" />
                </CardHeader>

                <CardContent className="w-full flex justify-center overflow-x-auto md:overflow-x-auto">
                    <div className="w-full">
                        <ChartContainer
                            className="min-h-[300px] w-full"
                            config={{
                                Completed: { color: "#10b981" },
                                "In Progress": { color: "#3b82f6" },
                                Planning: { color: "#f59e0b" },
                            }}
                        >
                            <PieChart>
                                <Pie
                                    data={projectStatusData}
                                    cx="50%"
                                    cy="50%"
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={0}
                                    label={({ name, percent }) =>
                                        `${name} (${(percent * 100).toFixed(0)}%)`
                                    }
                                    labelLine={false}
                                >
                                    {projectStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <ChartTooltip />
                                <ChartLegend content={<ChartLegendContent />} />
                            </PieChart>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-surface border-deep-surface shadow-md text-main-font">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-0.5">
                        <CardTitle className="text-base font-medium">
                            Task Priority
                        </CardTitle>
                        <CardDescription>Task priority breakdown</CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="w-full overflow-x-auto md:overflow-x-hidden">
                    <div className="w-full">
                        <ChartContainer
                            className="h-[300px] w-full"
                            config={{
                                High: { color: "#ef4444" },
                                Medium: { color: "#f59e0b" },
                                Low: { color: "#6b7280" },
                            }}
                        >
                            <PieChart>
                                <Pie
                                    data={taskPriorityData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) =>
                                        `${name} ${(percent * 100).toFixed(0)}%`
                                    }
                                    labelLine={false}
                                >
                                    {taskPriorityData?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <ChartTooltip />
                                <ChartLegend content={<ChartLegendContent />} />
                            </PieChart>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2 bg-surface border-deep-surface shadow-md text-main-font">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-0.5">
                        <CardTitle className="text-base font-medium">
                            Workspace Productivity
                        </CardTitle>
                        <CardDescription>Task completion by project</CardDescription>
                    </div>
                    <ChartBarBig className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="w-full overflow-x-auto md:overflow-x-hidden">
                    <div className="w-full">
                        <ChartContainer
                            className="h-[300px] w-full"
                            config={{
                                completed: { color: "#3b82f6" },
                                total: { color: "red" },
                            }}
                        >
                            <BarChart
                                data={workspaceProductivityData}
                                barGap={0}
                                barSize={20}
                            >
                                <XAxis
                                    dataKey="name"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar
                                    dataKey="total"
                                    fill="#ff7043"
                                    radius={[4, 4, 0, 0]}
                                    name="Total Tasks"
                                />
                                <Bar
                                    dataKey="completed"
                                    fill="#06923E"
                                    radius={[4, 4, 0, 0]}
                                    name="Completed Tasks"
                                />
                                <ChartLegend content={<ChartLegendContent />} />
                            </BarChart>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default StatisticsCharts