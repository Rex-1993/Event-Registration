import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getProjects, deleteProject, createProject } from "../../lib/api"
import { Button } from "../../components/ui/Button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card"
import { Plus, Users, Calendar, ArrowRight, Trash2, Edit, Copy } from "lucide-react"

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

  const handleDelete = async (e, id, title) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm(`確定要刪除專案「${title}」嗎？此動作無法復原。`)) {
      try {
        await deleteProject(id)
        fetchProjects()
      } catch (error) {
        alert("刪除專案時發生錯誤: " + error.message)
      }
    }
  }

  const handleCopy = async (e, project) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm(`確定要複製專案「${project.title}」嗎？`)) {
       try {
         // Create a copy of the project data, removing the ID and appending (副本) to the title
         const { id, created_at, ...projectData } = project
         const newProject = {
           ...projectData,
           title: `${project.title} (副本)`
         }
         await createProject(newProject)
         fetchProjects() // Refresh list
       } catch (error) {
         alert("複製專案時發生錯誤: " + error.message)
       }
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-neutral-200 pb-6">
        <div>
           <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">專案管理</h1>
           <p className="text-neutral-500 mt-1">管理您的活動報名專案</p>
        </div>
        <Link to="/admin/projects/create">
          <Button className="gap-2 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
            <Plus className="w-4 h-4" />
            建立新專案
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-neutral-400 flex flex-col items-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full mb-4"></div>
          載入專案中...
        </div>
      ) : projects.length === 0 ? (
        <Card className="text-center py-20 border-dashed border-2 bg-neutral-50/50 shadow-none">
          <CardContent>
             <p className="text-xl text-neutral-500 mb-6 font-medium">目前沒有任何專案</p>
             <Link to="/admin/projects/create">
                <Button variant="outline" className="h-12 px-6">建立您的第一個專案</Button>
             </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <Card key={project.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border-neutral-200/60">
              <div className="h-3 w-full" style={{ backgroundColor: project.theme_color }}></div>
              <CardHeader className="pb-3 relative">
                <div className="flex justify-between items-start">
                  <CardTitle className="truncate text-xl text-neutral-800 pr-8">{project.title}</CardTitle>
                  <div className="flex flex-col gap-1 -mt-1 -mr-1">
                     <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-neutral-400 hover:text-red-600 hover:bg-red-50"
                      onClick={(e) => handleDelete(e, project.id, project.title)}
                      title="刪除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Link to={`/admin/projects/${project.id}/edit`}>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-neutral-400 hover:text-blue-600 hover:bg-blue-50"
                        title="編輯"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-neutral-400 hover:text-green-600 hover:bg-green-50"
                      onClick={(e) => handleCopy(e, project)}
                      title="複製問卷"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="line-clamp-2 min-h-[40px] mt-2 text-neutral-500">{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-neutral-500 mb-6 bg-neutral-50 p-3 rounded-lg">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-primary-500" />
                    <span>上限: {parseInt(project.max_participants) === 0 ? "無限制" : project.max_participants}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                     <Calendar className="w-4 h-4 text-primary-500" />
                     <span>{project.created_at ? new Date(project.created_at.seconds * 1000).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
                <Link to={`/admin/projects/${project.id}`}>
                  <Button variant="outline" className="w-full gap-2 group-hover:bg-primary-50 group-hover:text-primary-700 group-hover:border-primary-200 transition-colors">
                    查看詳情
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
