import { Outlet, Link, useLocation } from "react-router-dom"
import { LayoutDashboard, LogOut } from "lucide-react"
import { cn } from "../lib/utils"

export default function AdminLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-morandi-cream flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-morandi-grey/20 hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-morandi-dark flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-morandi-sage" />
            Admin Panel
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Link
            to="/admin/projects"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              location.pathname.startsWith("/admin/projects")
                ? "bg-morandi-sage text-white"
                : "text-morandi-dark hover:bg-morandi-grey/10"
            )}
          >
            <LayoutDashboard className="w-5 h-5" />
            Projects
          </Link>
        </nav>

        <div className="p-4 border-t border-morandi-grey/10">
          <Link
            to="/admin/login"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 md:p-8 max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
