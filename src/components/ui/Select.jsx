import * as React from "react"
import { cn } from "../../lib/utils"

const Select = React.forwardRef(({ className, children, error, ...props }, ref) => {
  return (
    <div className="w-full">
      <div className="relative">
        <select
          className={cn(
            "flex h-11 w-full items-center justify-between rounded-md border border-morandi-grey/30 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-morandi-muted/50 focus:outline-none focus:ring-2 focus:ring-morandi-sage focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
             error && "border-red-400 focus-visible:ring-red-400",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <span className="absolute right-3 top-3.5 pointer-events-none text-morandi-dark">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
       {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  )
})
Select.displayName = "Select"

export { Select }
