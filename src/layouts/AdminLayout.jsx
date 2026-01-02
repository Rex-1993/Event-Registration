import { useState } from "react"
import { Outlet, Link, useLocation } from "react-router-dom"
import { LayoutDashboard, LogOut, Menu, X } from "lucide-react"
import { cn } from "../lib/utils"
import { ThemeToggle } from "../components/ThemeToggle"

export default function AdminLayout() {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col md:flex-row font-sans transition-colors duration-300">
      {/* Mobile Header */}
      <header className="md:hidden bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 p-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <h1 className="text-lg font-bold text-primary-900 dark:text-primary-100 flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          活動報名 <span className="text-xs bg-green-100 text-green-700 px-1 py-0.5 rounded font-bold">v1.4</span>
        </h1>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-2 -mr-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar (Desktop & Mobile) */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:shadow-none md:flex md:flex-col",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 hidden md:flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary-900 dark:text-primary-100 flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            活動報名系統 <span className="text-xs bg-purple-100 text-purple-700 px-1 py-0.5 rounded font-bold">v1.6</span>
          </h1>
          <ThemeToggle />
        </div>
        
        {/* Mobile Sidebar Header */}
        <div className="p-4 md:hidden flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800">
          <span className="font-bold text-neutral-900 dark:text-neutral-100">功能選單</span>
          <ThemeToggle />
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4 md:mt-0">
          <Link
            to="/admin/projects"
            onClick={() => setIsMobileMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
              location.pathname.startsWith("/admin/projects")
                ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-sm ring-1 ring-primary-100 dark:ring-primary-800"
                : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-200"
            )}
          >
            <LayoutDashboard className="w-5 h-5" />
            專案管理
          </Link>
        </nav>

        <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 space-y-4">
          <Link
            to="/admin/login"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            登出
          </Link>
          <div className="px-4 text-xs text-neutral-400 text-center">
            System Version: v1.0.1 (CN)
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden animate-in fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative w-full h-[calc(100vh-64px)] md:h-screen">
        <div className="absolute inset-0 bg-neutral-50 dark:bg-neutral-950 -z-10"></div>
        <div className="container mx-auto p-4 md:p-10 max-w-7xl pb-24 md:pb-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
