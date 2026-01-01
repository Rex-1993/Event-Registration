import * as React from "react"
import { cn } from "../../lib/utils"

const Textarea = React.forwardRef(({ className, error, ...props }, ref) => {
  return (
    <div className="w-full">
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-morandi-grey/30 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-morandi-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-morandi-sage focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-400 focus-visible:ring-red-400",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
