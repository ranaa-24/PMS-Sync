import React from "react";
import { ArrowDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ children, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group h-8 relative w-auto cursor-pointer overflow-hidden rounded-2xl border bg-background px-6 text-center font-semibold",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-1">
        <div className="h-2 w-2 rounded-full bg-primary transition-all duration-300 group-hover:scale-[100.8]"></div>
        <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {children}
        </span>
      </div>
      <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-1 text-primary-foreground opacity-0 transition-all duration-300 group-hover:-translate-x-4 group-hover:opacity-100">
        <span>{children}</span>
        <ArrowDownIcon size={16}/>
      </div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";
