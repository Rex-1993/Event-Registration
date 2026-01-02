import * as React from "react"
import { cn } from "../../lib/utils"

const Select = React.forwardRef(({ className, children, error, ...props }, ref) => {
  return (
    <div className="w-full">
      <div className="relative">
        <select
          className={cn(
            "flex h-11 w-full items-center justify-between rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 ring-offset-white dark:ring-offset-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none transition-all duration-200 hover:border-neutral-300 dark:hover:border-neutral-600",
             error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <span className="absolute right-3 top-3.5 pointer-events-none text-neutral-500">
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
