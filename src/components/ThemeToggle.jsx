import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  )

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
      title={theme === "light" ? "切換至深色模式" : "切換至明亮模式"}
    >
      {theme === "light" ? (
        <Sun className="h-5 w-5 text-neutral-600" />
      ) : (
        <Moon className="h-5 w-5 text-neutral-400" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
