import { Link, useLocation } from "react-router-dom"
import { Card, CardContent } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { CheckCircle } from "lucide-react"

export default function RegistrationSuccess() {
  const { state } = useLocation()
  const projectTitle = state?.projectTitle || "Activity"

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
      <div className="mb-6 rounded-full bg-green-100 p-6 text-green-600">
        <CheckCircle className="h-12 w-12" />
      </div>
      <h1 className="text-3xl font-bold text-morandi-dark mb-2">Registration Successful!</h1>
      <p className="text-morandi-muted mb-8 max-w-md">
        You have successfully registered for <strong>{projectTitle}</strong>.
        We look forward to seeing you there!
      </p>
      
      <div className="space-x-4">
        <Link to="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    </div>
  )
}
