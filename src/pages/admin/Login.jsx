import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Label } from "../../components/ui/Label"
import { Lock } from "lucide-react"

import { ThemeToggle } from "../../components/ThemeToggle"

export default function Login() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === "2335051") {
      localStorage.setItem("isAdmin", "true")
      navigate("/admin/projects")
    } else {
      setError("密碼錯誤")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4 transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <Card className="w-full max-w-md shadow-xl border-t-4 border-primary-500 bg-white dark:bg-neutral-900">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="mx-auto w-16 h-16 bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-2 ring-8 ring-primary-50/50 dark:ring-primary-900/10">
            <Lock className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">管理員登入</CardTitle>
            <CardDescription className="text-base text-neutral-500 dark:text-neutral-400 mt-1">請輸入訪問代碼以繼續</CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-neutral-700 dark:text-neutral-300">訪問代碼 (Password)</Label>
              <Input
                id="password"
                type="password"
                placeholder="請輸入密碼..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError("")
                }}
                error={error}
                className="h-12 text-lg tracking-widest bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border-neutral-200 dark:border-neutral-700"
              />
            </div>
          </CardContent>
          <CardFooter className="pb-8">
            <Button type="submit" className="w-full h-12 text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
              登入系統
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
