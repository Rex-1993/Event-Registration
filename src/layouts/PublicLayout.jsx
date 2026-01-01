import { Outlet } from "react-router-dom"

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80')] opacity-5 pointer-events-none mix-blend-multiply bg-cover bg-center"></div>
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:py-12 relative z-10">
        <Outlet />
      </main>
      <footer className="py-8 text-center text-sm text-neutral-500 relative z-10">
        © {new Date().getFullYear()} 活動報名系統
      </footer>
    </div>
  )
}
