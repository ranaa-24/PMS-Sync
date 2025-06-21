import { useAuthContext } from "@/providers/auth.context"
import { Button } from "@/components/ui/button";

function Dashboard() {
  const { user, logout } = useAuthContext();

  return (
    <div>
        Dashboard
    </div>
  )
}

export default Dashboard