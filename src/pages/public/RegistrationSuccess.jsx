import { Link, useLocation } from "react-router-dom"
import { Card, CardContent } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { CheckCircle } from "lucide-react"

export default function RegistrationSuccess() {
  const { state } = useLocation()
  const projectTitle = state?.projectTitle || "Activity"

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center animate-in scale-in-95 duration-500">
      <div className="mb-8 rounded-full bg-green-100 p-8 text-green-600 shadow-xl ring-8 ring-green-50 animate-bounce">
        <CheckCircle className="h-16 w-16" />
      </div>
      <h1 className="text-4xl font-extrabold text-neutral-900 mb-4 tracking-tight">報名成功！</h1>
      <p className="text-neutral-600 mb-10 max-w-lg text-lg leading-relaxed">
        您已成功報名 <strong>{projectTitle}</strong>。<br/>
        我們期待您的參與！
      </p>
      
      {state?.projectId && (
          <Link to={`/event/${state.projectId}`}>
            <Button className="px-8 h-12 text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 border-0 text-white rounded-full">
                返回活動頁面
            </Button>
          </Link>
      )}
    </div>
  )
}
