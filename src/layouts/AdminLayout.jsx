import { Outlet, Link, useLocation } from "react-router-dom"
import { LayoutDashboard, LogOut } from "lucide-react"
import { cn } from "../lib/utils"

export default function AdminLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-neutral-200 p-4 flex justify-between items-center shadow-sm z-30 sticky top-0">
        <h1 className="text-lg font-bold text-primary-900 flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-primary-600" />
          活動報名系統
        </h1>
        <Link to="/admin/login" className="text-neutral-500 hover:text-red-600">
          <LogOut className="w-5 h-5" />
        </Link>
      </div>

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 hidden md:flex flex-col shadow-sm z-20">
        <div className="p-6">
          <h1 className="text-xl font-bold text-primary-900 flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-primary-600" />
            活動報名系統
          </h1>
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
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-primary-200 -z-10"></div>
        <div className="container mx-auto p-6 md:p-10 max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
