import { Button } from "@/components/ui/button"
import { LayoutGrid, PlusSquareIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface PropsType{
    title: string, 
    description: string, 
    buttonText: string, 
    buttonAction: () => void, 
    className?: string
}

export const EmptyFeild = ({title, description, buttonAction, buttonText, className} : PropsType) =>{

    return (
        <div className="col-span-full text-center py-12 2xl:py-24">
            <LayoutGrid className=" size-8 md:size-12 mx-auto text-muted-foreground"/>
            <h3 className="mt-4 text-md md:text-lg font-semibold text-main-font">{title}</h3>
            <p className="mt-2 text-xs md:text-sm text-muted-foreground max-w-sm text-pretty mx-auto">
                {description}
            </p>

            <Button onClick={buttonAction} className={cn("mt-4 text-sx md:text-sm", className)}>
                <PlusSquareIcon className="font-bold size-5 sm:size-4" />
                {buttonText}
            </Button>
        </div>
    )
}