import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { checkDuplicate, getProject } from "../../lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Label } from "../../components/ui/Label"
import { getContrastYIQ } from "../../lib/utils"
import { Search, ArrowLeft, UserCheck } from "lucide-react"
import BackgroundShapes from "../../components/ui/BackgroundShapes"

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

  if (!project) return <div className="p-10 text-center"><div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"/></div>

  const textColor = getContrastYIQ(project.theme_color);

  return (
    <div className="min-h-screen w-full font-sans relative overflow-x-hidden pb-20">
      {/* Fixed Background Layer */}
      <div className="fixed inset-0 bg-[#f8f9fa] -z-20"></div>

      {/* Dynamic Background Decoration */}
      <BackgroundShapes themeColor={project?.theme_color || "#6366f1"} density={15} />

      {/* Hero Section */}
      <div 
        className="relative w-full h-[320px] shadow-lg flex flex-col items-center justify-center text-center px-4 pt-10 pb-24 rounded-b-[3rem]"
        style={{ 
          background: `linear-gradient(135deg, ${project.theme_color}, ${project.theme_color}dd)`,
          color: textColor
        }}
      >
        <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] rounded-b-[3rem]"></div>
        
        <Link to={`/event/${id}`} className="absolute top-6 left-6 z-20">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/20 border border-white/30 backdrop-blur-md"
            style={{ color: textColor, borderColor: textColor ? `${textColor}40` : undefined }}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            返回報名頁面
          </Button>
        </Link>

        <div className="relative z-10 space-y-4 max-w-4xl mx-auto animate-in slide-in-from-top-6 duration-700">
           <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow-sm" style={{ color: textColor }}>
             {project.title}
           </h1>
           <p className="text-xl font-medium opacity-90" style={{ color: textColor }}>
             報名狀態查詢
           </p>
        </div>
      </div>

      {/* Content Container (Overlapping Hero) */}
      <div className="container mx-auto px-4 -mt-20 relative z-20">
        <Card className="max-w-md mx-auto shadow-2xl bg-white/95 backdrop-blur-xl border-t-4" style={{ borderColor: project.theme_color }}>
        <CardHeader>
          <CardTitle>查詢報名資料</CardTitle>
          <CardDescription>請輸入您的完整姓名以查詢是否已報名成功。</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input 
              placeholder="請輸入姓名 (例如: 王小明)" 
              value={name} 
              onChange={e => setName(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit" isLoading={loading} className="px-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 shadow-md">
              <Search className="w-5 h-5" />
            </Button>
          </form>

          {results && (
            <div className="mt-8 space-y-4 animate-in slide-in-from-bottom-2">
              <h3 className="font-medium text-neutral-900 flex items-center gap-2">
                查詢結果:
              </h3>
              {results.length === 0 ? (
                <div className="p-6 bg-neutral-50 rounded-xl text-neutral-500 text-center border border-dashed border-neutral-200">
                  找不到 "{name}" 的報名資料
                </div>
              ) : (
                <div className="space-y-3">
                  {results.map((res, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-green-50/50 border border-green-200 rounded-xl text-green-800 shadow-sm">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-full">
                            <UserCheck className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <span className="font-bold block text-lg">{res.name}</span>
                            <span className="text-xs text-green-600/80">已報名成功</span>
                          </div>
                       </div>
                       <span className="text-sm font-medium bg-white/50 px-2 py-1 rounded-md border border-green-100/50">{res.registered_at}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
