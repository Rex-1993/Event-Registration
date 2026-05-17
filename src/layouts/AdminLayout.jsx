import { useState } from "react"
import { Outlet, Link, useLocation } from "react-router-dom"
import { LayoutDashboard, LogOut, Menu, X, ChevronLeft, ChevronRight, ClipboardList, Trash2 } from "lucide-react"
import { cn } from "../lib/utils"
import BackgroundShapes from "../components/ui/BackgroundShapes"

export default function AdminLayout() {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-primary-50/90 backdrop-blur-sm border-b border-neutral-200 p-4 flex justify-between items-center shadow-sm z-30 sticky top-0 relative">
        <h1 className="text-lg font-bold text-primary-900 flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-primary-600" />
          活動報名系統
        </h1>
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="text-neutral-600 hover:text-primary-600 p-1.5 rounded-lg hover:bg-primary-100/50 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Dropdown Menu */}
        {isMobileOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-neutral-200 p-4 flex flex-col gap-2 shadow-lg z-30 absolute top-full left-0 right-0 animate-in slide-in-from-top duration-200">
            <Link
              to="/admin/projects"
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                location.pathname.startsWith("/admin/projects")
                  ? "bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-100"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
              )}
            >
              <ClipboardList className="w-5 h-5 text-primary-600" />
              問卷管理
            </Link>
            <Link
              to="/admin/trash"
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                location.pathname.startsWith("/admin/trash")
                  ? "bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-100"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
              )}
            >
              <Trash2 className="w-5 h-5 text-primary-600" />
              回收桶
            </Link>
            <hr className="border-neutral-100" />
            <Link
              to="/admin/login"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              登出
            </Link>
            <div className="text-[10px] text-neutral-400 text-center mt-2">
              System Version: v1.0.1 (CN)
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-primary-50/50 border-r border-neutral-200 hidden md:flex flex-col shadow-sm z-20 transition-all duration-300 ease-in-out relative shrink-0",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-6 -right-3 z-30 w-6 h-6 rounded-full bg-white border border-neutral-200 shadow-md flex items-center justify-center cursor-pointer text-neutral-500 hover:text-primary-600 hover:scale-110 active:scale-95 transition-all"
          title={isCollapsed ? "展開選單" : "收起選單"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <div className={cn("p-6 transition-all duration-300", isCollapsed ? "px-4 text-center" : "")}>
          {isCollapsed ? (
            <LayoutDashboard className="w-8 h-8 text-primary-600 mx-auto" />
          ) : (
            <h1 className="text-xl font-bold text-primary-900 flex items-center gap-2 whitespace-nowrap animate-in fade-in duration-300">
              <LayoutDashboard className="w-6 h-6 text-primary-600" />
              活動報名系統
            </h1>
          )}
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Link
            to="/admin/projects"
            className={cn(
              "flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200",
              isCollapsed ? "h-11 w-11 p-0 justify-center mx-auto" : "px-4 py-3",
              location.pathname.startsWith("/admin/projects")
                ? "bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-100"
                : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
            )}
            title={isCollapsed ? "問卷管理" : undefined}
          >
            <ClipboardList className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="animate-in fade-in duration-300">問卷管理</span>}
          </Link>

          <Link
            to="/admin/trash"
            className={cn(
              "flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200",
              isCollapsed ? "h-11 w-11 p-0 justify-center mx-auto" : "px-4 py-3",
              location.pathname.startsWith("/admin/trash")
                ? "bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-100"
                : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
            )}
            title={isCollapsed ? "回收桶" : undefined}
          >
            <Trash2 className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="animate-in fade-in duration-300">回收桶</span>}
          </Link>
        </nav>

        <div className={cn("p-4 border-t border-neutral-100", isCollapsed ? "px-2" : "")}>
          <Link
            to="/admin/login"
            className={cn(
              "flex items-center gap-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors",
              isCollapsed ? "h-11 w-11 p-0 justify-center mx-auto" : "px-4 py-3"
            )}
            title={isCollapsed ? "登出" : undefined}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="animate-in fade-in duration-300">登出</span>}
          </Link>
          {!isCollapsed && (
            <div className="mt-4 px-4 text-xs text-neutral-400 text-center animate-in fade-in duration-300">
              System Version: v1.0.1 (CN)
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        <div className="fixed inset-0 bg-gradient-to-br from-primary-200 to-primary-300 -z-20"></div>
        <BackgroundShapes themeColor="#ffffff" density={15} />
        <div className="container mx-auto p-6 md:p-10 max-w-7xl relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
