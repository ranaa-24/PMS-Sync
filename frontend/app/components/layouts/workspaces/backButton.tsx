import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react"
import { useNavigate } from "react-router"

function BackButton() {
    const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => navigate(-1)}
      className="mr-2 rounded-md hover:bg-accent transition"
      aria-label="Go back"
    >
      <ArrowLeftIcon className="size-5" />
    </Button>
  )
}

export default BackButton