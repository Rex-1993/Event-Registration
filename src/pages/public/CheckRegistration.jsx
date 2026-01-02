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

  if (!project) return <div className="p-10 text-center"><div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"/></div>

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Link to={`/event/${id}`} className="flex items-center text-neutral-500 hover:text-primary-600 text-sm mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> 返回報名頁面
      </Link>

      <div className="text-center mb-8 space-y-2">
        <h1 className="text-3xl font-bold text-neutral-900">{project.title}</h1>
        <p className="text-neutral-500">報名狀態查詢</p>
      </div>

      <Card className="max-w-md mx-auto shadow-lg border-t-4 border-primary-500">
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
  )
}
