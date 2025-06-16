import { Outlet, Navigate } from "react-router"
import { useAuthContext } from "@/providers/auth.context"

function AuthLayout() {
  const {isAuthenticated, isLoading} = useAuthContext();
  if(isLoading){
    return <div className="w-full h-screen flex justify-center items-center">
        Loading....
    </div>
  }

  // if we use naviage(/dashboard) it will causes a recursive hell, cz, if we navigate to /login or / by typing in address
  //  bar that will cause a rerender of this 
  // component coz this is layout of /login or /, we may redirect to /dashboard but this componnent wont un mount cz we aint retunring a jsx from here which will again run navigate("/dashboard") runs again.

  // useNavigate() should only be used for side effects — like in response to a user action (e.g., button click) or inside a useEffect. 
  // A component must always return JSX, not imperatively call navigation during render.
  
  // main take ways is AuthLayout is a component must return a JSX, so when we return <Navigate to="/dashboard" replace /> no futher execution is done and we are rendering a new component called <Navigate> it will remove this componet for component tree

  if(isAuthenticated){
      return <Navigate to="/dashboard" replace />;
  }

  return (
    <section>
        <Outlet />
    </section>
  )
}
 
export default AuthLayout