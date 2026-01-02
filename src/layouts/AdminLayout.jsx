import { Outlet, Link, useLocation } from "react-router-dom"
import { LayoutDashboard, LogOut } from "lucide-react"
import { cn } from "../lib/utils"
import { ThemeToggle } from "../components/ThemeToggle"

export default function AdminLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex font-sans transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 hidden md:flex flex-col shadow-sm z-20">
        <div className="p-6 flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary-900 dark:text-primary-100 flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-primary-600" />
            活動報名系統
          </h1>
          <ThemeToggle />
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Link
            to="/admin/projects"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
              location.pathname.startsWith("/admin/projects")
                ? "bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-100"
                : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
            )}
          >
            <LayoutDashboard className="w-5 h-5" />
            專案管理
          </Link>
        </nav>

        <div className="p-4 border-t border-neutral-100">
          <Link
            to="/admin/login"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            登出
          </Link>
          <div className="mt-4 px-4 text-xs text-neutral-400 text-center">
            System Version: v1.0.1 (CN)
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        <div className="absolute inset-0 bg-neutral-50 -z-10"></div>
        <div className="container mx-auto p-6 md:p-10 max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
