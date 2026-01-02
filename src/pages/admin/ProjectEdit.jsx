import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getProject, updateProject } from "../../lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Label } from "../../components/ui/Label"
import { Textarea } from "../../components/ui/Textarea"
import FormBuilder from "../../components/admin/FormBuilder"
import { Loader2, Save, Trash2, LayoutTemplate } from "lucide-react"
import { STANDARD_TEMPLATES } from "../../lib/templates"

export default function ProjectEdit() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [customTemplates, setCustomTemplates] = useState({})
  const [selectedTemplate, setSelectedTemplate] = useState("")
  
  const [formData, setFormData] = useState({
    title: "",
    organizer: "",
    co_organizer: "",
    description: "",
    theme_color: "#98A697",
    max_participants: 100,
    fields: [],
  })

  useEffect(() => {
    // Load custom templates
    const saved = localStorage.getItem("customTemplates")
    if (saved) {
      try {
        setCustomTemplates(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load templates", e)
      }
    }

    // Load project data
    async function load() {
      try {
        const data = await getProject(id)
        setFormData(data)
      } catch (error) {
        alert("載入專案失敗: " + error.message)
        navigate("/admin/projects")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, navigate])

  const handleApplyTemplate = (key) => {
    if (!key) return
    
    let template = STANDARD_TEMPLATES[key]
    if (!template) {
        template = customTemplates[key]
    }

    if (template && confirm("這將會覆蓋目前的欄位設定。確定要繼續嗎？")) {
      setFormData(prev => ({
        ...prev,
        fields: JSON.parse(JSON.stringify(template.fields)) // Deep copy
      }))
    }
  }

  const handleSaveTemplate = () => {
    const name = prompt("請輸入範本名稱:")
    if (!name) return

    const newTemplateId = `custom_${Date.now()}`
    const newTemplate = {
        label: `${name} (自訂)`,
        fields: formData.fields
    }

    const updated = { ...customTemplates, [newTemplateId]: newTemplate }
    setCustomTemplates(updated)
    localStorage.setItem("customTemplates", JSON.stringify(updated))
    alert("範本已儲存！")
    setSelectedTemplate(newTemplateId)
  }

  const handleDeleteTemplate = () => {
    if (!selectedTemplate.startsWith("custom_")) {
        alert("只能刪除自訂範本！")
        return
    }
    
    if (confirm("確定要刪除此範本嗎？")) {
        const updated = { ...customTemplates }
        delete updated[selectedTemplate]
        setCustomTemplates(updated)
        localStorage.setItem("customTemplates", JSON.stringify(updated))
        setSelectedTemplate("")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await updateProject(id, formData)
      navigate("/admin/projects")
    } catch (error) {
      alert("更新專案時發生錯誤: " + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary-600 h-8 w-8" /></div>

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-200 pb-6">
        <div>
           <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">編輯專案</h1>
           <p className="text-neutral-500 mt-1">修改活動與表單設定</p>
        </div>

        <div className="flex items-center gap-2 bg-neutral-100 p-2 rounded-lg border border-neutral-200 w-full sm:w-auto">
           <LayoutTemplate className="w-4 h-4 text-neutral-500 ml-2" />
           <select 
             className="bg-transparent border-none text-sm focus:ring-0 text-neutral-700 font-medium w-full sm:w-48"
             value={selectedTemplate}
             onChange={(e) => {
                setSelectedTemplate(e.target.value)
                handleApplyTemplate(e.target.value)
             }}
           >
             <option value="">-- 套用快速範本 --</option>
             <optgroup label="內建範本">
                {Object.keys(STANDARD_TEMPLATES).map(key => (
                    <option key={key} value={key}>{STANDARD_TEMPLATES[key].label}</option>
                ))}
             </optgroup>
             {Object.keys(customTemplates).length > 0 && (
                 <optgroup label="自訂範本">
                    {Object.keys(customTemplates).map(key => (
                        <option key={key} value={key}>{customTemplates[key].label}</option>
                    ))}
                 </optgroup>
             )}
           </select>
           {selectedTemplate.startsWith("custom_") && (
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-neutral-400 hover:text-red-600"
                    onClick={handleDeleteTemplate}
                    title="刪除此範本"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
           )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="shadow-lg border-t-4 border-primary-500 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary-100 to-primary-200 pb-6">
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
                 <Label className="text-neutral-700">人數上限 (設定 0 為無限制)</Label>
                 <Input type="number" required min="0" value={formData.max_participants} onChange={e => setFormData({...formData, max_participants: e.target.value})} className="focus:ring-primary-500" />
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
          <CardHeader className="bg-gradient-to-r from-secondary-100 to-secondary-200 pb-6 flex flex-row justify-between items-center">
            <div>
                <CardTitle className="text-xl text-neutral-800">報名表單設計</CardTitle>
                <CardDescription>自訂參加者需要填寫的欄位</CardDescription>
            </div>
             <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleSaveTemplate}
                className="bg-white/50 hover:bg-white text-secondary-700 border-secondary-200"
            >
                <Save className="w-4 h-4 mr-2" />
                將目前表單存為範本
            </Button>
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
           <Button type="submit" isLoading={submitting} className="h-12 px-8 text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5" style={{ backgroundColor: formData.theme_color || undefined }}>儲存修改</Button>
        </div>
      </form>
    </div>
  )
}
