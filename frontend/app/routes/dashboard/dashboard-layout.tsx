import { Navigate, Outlet } from "react-router"
import { useAuthContext } from "@/providers/auth.context"
import Loader from "@/components/common/Loader";
import Header from "@/components/layouts/header";
import { useState } from "react";
import { type WorkSpaceType } from "@/types";
import SidebarComponent from "@/components/layouts/sidebar";
import CreateWorkspace from "@/components/layouts/workspaces/ceateWorkspace";
import { getData } from "@/lib/api-request-utils";



//clientLoader in react router, why fetching the content after initial rennder, it will fetch the data before component loads
export const clientLoader = async () => {
  try {
    //Returns a single promise, Resolves when all promises resolve, The result is an array of values
    const [workspaces] = await Promise.all([getData('/workspaces')]);

    return {workspaces};    // this will availabe in useLoaderData() of this component/route or any subroute

  } catch (error) {
    console.log("Error in dashboard layout..", error);
  }
}

function DashboardLayout() {
  const { isAuthenticated, isLoading } = useAuthContext();
  const [isCreatingWorkSpace, setIsCreatingWorkSpace] = useState(false);
  const [currentWorkSpace, setCurrentWorkSpace] = useState<WorkSpaceType | null>(null);


  const handleWorkSpaceSelected = (workSpace: WorkSpaceType) => {
    setCurrentWorkSpace(workSpace);
  }


  if (isLoading) {
    return <div className="min-h-screen w-full flex justify-center items-center">
      <Loader />
    </div>
  }

  if (!isAuthenticated) {
    return <Navigate to={'/login'} replace />
  }


  return (
    <div className="flex h-screen w-full">
      <SidebarComponent currentWorkSpace={currentWorkSpace} />

      <div className="flex flex-1 flex-col">
        <Header
          onWorkSpaceSelected={handleWorkSpaceSelected}
          selectedWorkSpace={currentWorkSpace}
          onCreatedWorkSpace={() => setIsCreatingWorkSpace(true)}
        />

        <main className="flex-1 overflow-y-auto p-0 h-full w-full sticky">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 py-2 md:py-6 w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Invisible modal */}
      <CreateWorkspace
        isCreatingWorkSpace={isCreatingWorkSpace}
        setIsCreatingWorkSpace={setIsCreatingWorkSpace}
      />

    </div>
  )
}

export default DashboardLayout