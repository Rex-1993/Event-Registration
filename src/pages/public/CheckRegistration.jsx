import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { checkDuplicate, getProject } from "../../lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Label } from "../../components/ui/Label"
import { Search, ArrowLeft, UserCheck } from "lucide-react"

export default function CheckRegistration() {
  const { id } = useParams()
  const [name, setName] = useState("")
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [project, setProject] = useState(null)

  useEffect(() => {
    getProject(id).then(setProject).catch(console.error)
  }, [id])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    
    setLoading(true)
    try {
      const data = await checkDuplicate(id, name.trim())
      setResults(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!project) return <div className="p-10 text-center"><div className="animate-spin h-6 w-6 border-2 border-morandi-sage border-t-transparent rounded-full mx-auto"/></div>

  return (
    <div className="space-y-6">
      <Link to={`/event/${id}`} className="flex items-center text-morandi-muted hover:text-morandi-dark text-sm mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Registration
      </Link>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-morandi-dark">{project.title}</h1>
        <p className="text-morandi-muted">Check Registration Status</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Registration</CardTitle>
          <CardDescription>Enter your exact name to check if you are registered.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input 
              placeholder="Enter your name (e.g. 王小明)" 
              value={name} 
              onChange={e => setName(e.target.value)}
              required
            />
            <Button type="submit" isLoading={loading}>
              <Search className="w-4 h-4" />
            </Button>
          </form>

          {results && (
            <div className="mt-6 space-y-4">
              <h3 className="font-medium text-morandi-dark">Search Results:</h3>
              {results.length === 0 ? (
                <div className="p-4 bg-morandi-grey/10 rounded-lg text-morandi-muted text-center">
                  No registration found for "{name}"
                </div>
              ) : (
                <div className="space-y-2">
                  {results.map((res, index) => (
                     <div key={index} className="flex items-center justify-between p-4 bg-green-50 border border-green-100 rounded-lg text-green-800">
                        <div className="flex items-center gap-2">
                           <UserCheck className="w-5 h-5" />
                           <span className="font-bold">{res.name}</span>
                        </div>
                        <span className="text-sm opacity-80">{res.registered_at}</span>
                     </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
