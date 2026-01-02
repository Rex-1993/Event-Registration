import { Moon, Sun } from "lucide-react"
import { useTheme } from "./ThemeProvider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

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
