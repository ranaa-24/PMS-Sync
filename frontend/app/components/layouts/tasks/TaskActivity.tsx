import DataNotFound from "@/components/common/dataNotFound";
import Loader from "@/components/common/Loader";
import { getData } from "@/lib/api-request-utils";
import type { ActivityLog } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getActivityIcon } from "./taskIcons";

function TaskActivity({ resourceId }: { resourceId: string }) {
    const { data, isPending } = useQuery({
        queryKey: ["task-activity", resourceId],
        queryFn: () => getData(`/tasks/${resourceId}/activity`),
    }) as {
        data: ActivityLog[];
        isPending: boolean;
    };

    if (!data) return <div className='bg-surface border border-main-border rounded-lg p-6 shadow-sm flex items-center justify-center text-secondary-font'>
        Failed to load Activities.
    </div>


    if (isPending) return <Loader />;

    return (
        <div className="bg-surface border border-main-border rounded-lg p-6 shadow-sm max-h-screen overflow-y-auto">
            <h3 className="text-base font-semibold text-main-font mb-3">Activities</h3>

            <div className="space-y-4">
                {data?.map((activity) => (
                    <div key={activity._id} className="flex gap-2">
                        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            {getActivityIcon(activity.action)}
                        </div>

                        <div className="ml-2 flex items-center">
                            <p className="text-sm">
                                <span className="font-bold">{activity.user.name}</span>{" "}
                                {activity.details?.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TaskActivity