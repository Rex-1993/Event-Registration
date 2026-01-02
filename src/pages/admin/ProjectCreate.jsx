import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createProject } from "../../lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Label } from "../../components/ui/Label"
import { Textarea } from "../../components/ui/Textarea"
import FormBuilder from "../../components/admin/FormBuilder"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/Select"

const TEMPLATES = {
  singing: {
    label: "歌唱比賽 (Singing Contest)",
    fields: [
      { id: "1", label: "姓名", type: "text", required: true },
      { id: "2", label: "性別", type: "radio", options: "男, 女", required: true },
      { id: "3", label: "歌名", type: "text", required: true },
      { id: "4", label: "原唱", type: "text", required: true },
      { id: "5", label: "歌曲編號", type: "text", required: false },
      { id: "6", label: "升降Key", type: "select", options: "原調, +1, +2, -1, -2", required: true },
      { id: "7", label: "電話", type: "text", required: true },
      { id: "8", label: "便當", type: "radio", options: "葷, 素", required: true },
      { id: "9", label: "伴唱機品牌", type: "select", options: "弘音, 音圓, 金嗓, 瑞影, 美華", required: true },
    ]
  },
  tour: {
    label: "遊覽車旅遊 (Bus Tour)",
    fields: [
      { id: "1", label: "姓名", type: "text", required: true },
      { id: "2", label: "身分證字號", type: "text", required: true },
      { id: "3", label: "生日", type: "date", required: true },
      { id: "4", label: "手機", type: "text", required: true },
      { id: "5", label: "緊急聯絡人/電話", type: "text", required: true },
      { id: "6", label: "上車地點", type: "radio", options: "地點A, 地點B, 自行前往", required: true },
      { id: "7", label: "房型", type: "select", options: "兩人房, 四人房, 單人房 (補差價)", required: true },
       { id: "8", label: "用餐", type: "radio", options: "葷, 素", required: true },
    ]
  },
  assembly: {
    label: "會員大會 (Member Assembly)",
    fields: [
      { id: "1", label: "會員編號", type: "text", required: true },
      { id: "2", label: "姓名", type: "text", required: true },
      { id: "3", label: "出席方式", type: "radio", options: "親自出席, 委託出席, 不克出席", required: true },
      { id: "4", label: "衣服尺寸", type: "select", options: "XS, S, M, L, XL, 2XL", required: true },
      { id: "5", label: "提案建議", type: "textarea", required: false },
    ]
  },
  conference: {
    label: "學術研討會 (Conference)",
    fields: [
      { id: "1", label: "姓名 (Name)", type: "text", required: true },
      { id: "2", label: "電子郵件 (Email)", type: "email", required: true },
      { id: "3", label: "服務單位 (Affiliation)", type: "text", required: true },
      { id: "4", label: "飲食偏好 (Dietary)", type: "select", options: "葷食, 素食, 穆斯林友善", required: true },
      { id: "5", label: "是否投稿 (Abstract)", type: "radio", options: "是, 否", required: true },
    ]
  },
  volunteer: {
    label: "志工招募 (Volunteer)",
    fields: [
      { id: "1", label: "姓名", type: "text", required: true },
      { id: "2", label: "聯絡電話", type: "text", required: true },
      { id: "3", label: "可服務時段", type: "checkbox", options: "週間上午, 週間下午, 週末全天", required: true },
      { id: "4", label: "專長技能", type: "textarea", required: true },
      { id: "5", label: "T恤尺寸", type: "select", options: "S, M, L, XL", required: true },
    ]
  },
  reunion: {
    label: "同學會 (Reunion)",
    fields: [
      { id: "1", label: "姓名", type: "text", required: true },
      { id: "2", label: "畢業年份", type: "text", required: true },
      { id: "3", label: "參加人數 (含眷屬)", type: "select", options: "1人, 2人, 3人, 4人以上", required: true },
      { id: "4", label: "飲食禁忌", type: "text", required: false },
    ]
  },
  groupbuy: {
    label: "團購登記 (Group Buy)",
    fields: [
      { id: "1", label: "訂購人姓名", type: "text", required: true },
      { id: "2", label: "商品選項", type: "select", options: "A套餐, B套餐, C套餐", required: true },
      { id: "3", label: "數量", type: "number", required: true },
      { id: "4", label: "配送地址", type: "text", required: true },
      { id: "5", label: "備註事項", type: "textarea", required: false },
    ]
  }
}

export default function ProjectCreate() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    organizer: "",
    co_organizer: "",
    description: "",
    theme_color: "#98A697", // Default Sage
    max_participants: 100,
    fields: [],
  })

  const applyTemplate = () => {
    if (!selectedTemplate) return
    if (confirm("這將會覆蓋目前的欄位設定。確定要繼續嗎？")) {
      setFormData(prev => ({
        ...prev,
        fields: JSON.parse(JSON.stringify(TEMPLATES[selectedTemplate].fields)) // Deep copy
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createProject(formData)
      navigate("/admin/projects")
    } catch (error) {
      alert("建立專案時發生錯誤: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-200 pb-6">
        <div>
           <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">建立新專案</h1>
           <p className="text-neutral-500 dark:text-neutral-400 mt-1">設定活動詳情與報名表單</p>
        </div>
        <div className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-900 p-2 rounded-lg border border-neutral-200 dark:border-neutral-800">
           <span className="text-sm text-neutral-600 dark:text-neutral-400 font-medium px-2 whitespace-nowrap">快速範本:</span>
           <div className="w-[200px]">
             <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
               <SelectTrigger className="h-9">
                 <SelectValue placeholder="選擇範本..." />
               </SelectTrigger>
               <SelectContent>
                 {Object.keys(TEMPLATES).map(key => (
                   <SelectItem key={key} value={key}>
                     {TEMPLATES[key].label}
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>
           <Button 
             size="sm" 
             variant="outline" 
             type="button" 
             onClick={applyTemplate}
             disabled={!selectedTemplate}
             className="h-9 text-primary-600 dark:text-primary-400 hover:text-primary-700 hover:bg-white dark:hover:bg-neutral-800"
           >
             套用
           </Button>
        </div>
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
           <Button type="submit" isLoading={loading} className="h-12 px-8 text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5" style={{ backgroundColor: formData.theme_color || undefined }}>建立專案</Button>
        </div>
      </form>
    </div>
  )
}
