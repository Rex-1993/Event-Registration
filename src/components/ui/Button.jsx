import * as React from "react"
import { cn } from "../../lib/utils"
import { Loader2 } from "lucide-react"

const Button = React.forwardRef(({ className, variant = "default", size = "default", isLoading, children, ...props }, ref) => {
  const variants = {
    default: "bg-morandi-sage text-white hover:opacity-90 shadow-sm",
    secondary: "bg-morandi-rose text-white hover:opacity-90 shadow-sm",
    outline: "border border-morandi-slate text-morandi-slate hover:bg-morandi-slate/10",
    ghost: "text-morandi-dark hover:bg-morandi-grey/20",
    danger: "bg-red-400 text-white hover:opacity-90"
  }

  const sizes = {
    default: "h-11 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-12 rounded-md px-8",
    icon: "h-11 w-11",
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-morandi-sage focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
})
Button.displayName = "Button"

export { Button }
