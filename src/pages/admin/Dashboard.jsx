import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getProjects } from "../../lib/api"
import { Button } from "../../components/ui/Button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card"
import { Plus, Users, Calendar, ArrowRight } from "lucide-react"

export default function Dashboard() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const data = await getProjects()
      setProjects(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold text-morandi-dark">Projects</h1>
           <p className="text-morandi-muted">Manage your activity registrations</p>
        </div>
        <Link to="/admin/projects/create">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Project
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-10 text-morandi-muted">Loading projects...</div>
      ) : projects.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
             <p className="text-lg text-morandi-dark mb-4">No projects found</p>
             <Link to="/admin/projects/create">
                <Button variant="outline">Create your first project</Button>
             </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <div className="h-2 w-full rounded-t-xl" style={{ backgroundColor: project.theme_color }}></div>
              <CardHeader>
                <CardTitle className="truncate">{project.title}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px]">{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-morandi-muted mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>Max: {project.max_participants}</span>
                  </div>
                  <div className="flex items-center gap-1">
                     <Calendar className="w-4 h-4" />
                     <span>{project.created_at ? new Date(project.created_at.seconds * 1000).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
                <Link to={`/admin/projects/${project.id}`}>
                  <Button variant="outline" className="w-full gap-2 group">
                    View Details
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
