import { Outlet } from "react-router-dom"

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-morandi-cream flex flex-col">
      <main className="flex-1 w-full max-w-3xl mx-auto p-4 md:py-10">
        <Outlet />
      </main>
      <footer className="py-6 text-center text-sm text-morandi-muted/80">
        © {new Date().getFullYear()} Activity Registration System
      </footer>
    </div>
  )
}
