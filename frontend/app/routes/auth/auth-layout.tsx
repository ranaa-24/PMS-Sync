import { Outlet, Navigate } from "react-router"
import { useAuthContext } from "@/providers/auth.context"

function AuthLayout() {
  const {isAuthenticated, isLoading} = useAuthContext();
  if(isLoading){
    return <div className="w-full h-screen flex justify-center items-center">
        Loading....
    </div>
  }

  if(isAuthenticated){
    <Navigate to='/dashboard' />
  }

  return (
    <section>
        <Outlet />
    </section>
  )
}
 
export default AuthLayout