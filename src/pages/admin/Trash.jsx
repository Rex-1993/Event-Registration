import { useEffect, useState } from "react"
import { dialog } from "../../lib/dialog"
import { getTrashedProjects, hardDeleteProject, restoreFromTrash } from "../../lib/api"
import { Button } from "../../components/ui/Button"
import { Link } from "react-router-dom"
import { ArrowRight, Trash2, RotateCcw, AlertTriangle } from "lucide-react"

export default function Trash() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  const loadProjects = async () => {
    try {
      setLoading(true)
      const data = await getTrashedProjects()
      setProjects(data)
    } catch (error) {
      console.error("Error loading trashed projects:", error)
      await dialog.alert("載入回收桶失敗: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const handleRestore = async (id, title) => {
    try {
      await restoreFromTrash(id)
      await dialog.alert(`專案「${title}」已成功復原！`)
      loadProjects()
    } catch (error) {
      await dialog.alert("復原專案時發生錯誤: " + error.message)
    }
  }

  const handleHardDelete = async (id, title) => {
    if (await dialog.confirm(`警告：這將永久刪除「${title}」以及所有關聯的報名資料！\n此操作無法復原。確定要繼續嗎？`)) {
      try {
        await hardDeleteProject(id)
        loadProjects()
      } catch (error) {
        await dialog.alert("永久刪除專案時發生錯誤: " + error.message)
      }
    }
  }

  const handleEmptyTrash = async () => {
    if (projects.length === 0) return
    if (await dialog.confirm("警告：這將永久刪除回收桶內的所有專案！\n確定要繼續嗎？")) {
      try {
        setLoading(true)
        for (const project of projects) {
          await hardDeleteProject(project.id)
        }
        await dialog.alert("回收桶已清空！")
        loadProjects()
      } catch (error) {
        await dialog.alert("清空回收桶時發生錯誤: " + error.message)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-200 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">回收桶</h1>
            <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
              {projects.length} 個專案
            </span>
          </div>
          <p className="text-neutral-500 mt-1">被刪除的專案將保留 30 天，之後將被永久刪除</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleEmptyTrash}
          disabled={loading || projects.length === 0}
          className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          清空回收桶
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-neutral-500">載入中...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-24 bg-neutral-50 rounded-2xl border border-neutral-200/60 border-dashed">
          <Trash2 className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500 text-lg">回收桶目前是空的</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="group bg-white border border-neutral-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-lg text-neutral-900 line-clamp-1">{project.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full bg-orange-100 text-orange-700">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    剩餘 {project.days_left} 天
                  </div>
                </div>
                
                <div className="mt-2">
                  <Link to={`/admin/projects/${project.id}`}>
                    <Button variant="outline" size="sm" className="h-8 px-3 text-xs gap-1 hover:border-primary-300 hover:text-primary-700">
                      <span>詳情</span>
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleRestore(project.id, project.title)}
                  className="flex-1 sm:flex-none text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                >
                  <RotateCcw className="w-4 h-4 mr-1.5" />
                  復原
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleHardDelete(project.id, project.title)}
                  className="flex-1 sm:flex-none text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                >
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  永久刪除
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
