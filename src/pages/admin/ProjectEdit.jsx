import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getProject, updateProject } from "../../lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Label } from "../../components/ui/Label"
import { Textarea } from "../../components/ui/Textarea"
import FormBuilder from "../../components/admin/FormBuilder"
import { Loader2, ArrowLeft } from "lucide-react"

export default function ProjectEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getProject(id)
        setFormData(data)
      } catch (error) {
        alert("載入專案時發生錯誤: " + error.message)
        navigate("/admin/projects")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { id: _, created_at, ...updateData } = formData
      await updateProject(id, updateData)
      navigate("/admin/projects")
    } catch (error) {
      alert("儲存專案時發生錯誤: " + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary-600 h-8 w-8" /></div>
  if (!formData) return null

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 animate-in fade-in duration-500">
      <div className="border-b border-neutral-200 pb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 -ml-2 text-neutral-500 hover:text-primary-600">
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回
        </Button>
        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">編輯專案</h1>
        <p className="text-neutral-500 mt-1">修改活動詳情與報名表單</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="shadow-lg border-t-4 border-primary-500 overflow-hidden">
          <CardHeader className="bg-neutral-50/50 pb-6">
            <CardTitle className="text-xl text-neutral-800">基本設定</CardTitle>
            <CardDescription>設定活動的基本資訊與外觀</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-neutral-700">活動名稱</Label>
                <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="請輸入活動名稱" className="focus:ring-primary-500" />
              </div>
              <div className="space-y-2">
                 <Label className="text-neutral-700">人數上限 (設定為 0 代表無限制)</Label>
                 <Input type="number" required value={formData.max_participants} onChange={e => setFormData({...formData, max_participants: e.target.value})} className="focus:ring-primary-500" />
              </div>
              <div className="space-y-2">
                <Label className="text-neutral-700">主辦單位</Label>
                <Input required value={formData.organizer} onChange={e => setFormData({...formData, organizer: e.target.value})} placeholder="請輸入主辦單位" className="focus:ring-primary-500" />
              </div>
              <div className="space-y-2">
                <Label className="text-neutral-700">協辦單位</Label>
                <Input value={formData.co_organizer} onChange={e => setFormData({...formData, co_organizer: e.target.value})} placeholder="選填" className="focus:ring-primary-500" />
              </div>
            </div>
            
            <div className="space-y-2">
               <Label className="text-neutral-700">活動說明</Label>
               <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="請輸入活動詳細說明..." className="min-h-[120px] focus:ring-primary-500" />
            </div>

            <div className="space-y-2">
               <Label className="text-neutral-700">主題顏色 (Theme Color)</Label>
               <div className="flex items-center gap-4 p-3 border border-neutral-200 rounded-lg bg-neutral-50/50">
                 <Input 
                   type="color" 
                   value={formData.theme_color} 
                   onChange={e => setFormData({...formData, theme_color: e.target.value})} 
                   className="w-16 h-10 p-1 cursor-pointer hover:scale-105 transition-transform"
                 />
                 <span className="text-sm font-mono text-neutral-500 bg-white px-3 py-1 rounded border border-neutral-200">{formData.theme_color}</span>
                 <div className="flex-1 h-2 rounded-full mx-4" style={{ backgroundColor: formData.theme_color }}></div>
               </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-t-4 border-secondary-500 overflow-hidden">
          <CardHeader className="bg-neutral-50/50 pb-6">
            <CardTitle className="text-xl text-neutral-800">報名表單設計</CardTitle>
            <CardDescription>自訂參加者需要填寫的欄位</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <FormBuilder 
              value={formData.fields} 
              onChange={fields => setFormData({...formData, fields})}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 pt-4">
           <Button type="button" variant="outline" onClick={() => navigate("/admin/projects")} className="h-12 px-8 text-neutral-600 hover:text-neutral-900 border-neutral-300">取消</Button>
           <Button type="submit" isLoading={saving} className="h-12 px-8 text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5" style={{ backgroundColor: formData.theme_color || undefined }}>儲存修改</Button>
        </div>
      </form>
    </div>
  )
}
