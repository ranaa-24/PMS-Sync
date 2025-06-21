import { Navigate, Outlet } from "react-router"
import { useAuthContext } from "@/providers/auth.context"
import Loader from "@/components/common/Loader";
import Header from "@/components/layouts/header";
import { useState } from "react";
import { type WorkSpaceType } from "@/types";
import SidebarComponent from "@/components/layouts/sidebar";
import CreateWorkspace from "@/components/layouts/workspaces/ceateWorkspace";

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
          selectedWorkSpace={null}
          onCreatedWorkSpace={() => setIsCreatingWorkSpace(true)}
        />

        <main className="flex-1 overflow-y-auto p-0 h-full w-full">
          <div className="container mx-auto px-2 md:px-6 lg:px-8 py-0 md:py-6 w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>

      <CreateWorkspace
        isCreatingWorkSpace={isCreatingWorkSpace}
        setIsCreatingWorkSpace={setIsCreatingWorkSpace}
      />

    </div>
  )
}

export default DashboardLayout