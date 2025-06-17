import { useAuthContext } from "@/providers/auth.context"
import { Button } from "@/components/ui/button";

function Dashboard() {
  const { user, logout } = useAuthContext();

  return (
    <div>
        <Button onClick={logout}>Logout</Button>
    </div>
  )
}

export default Dashboard