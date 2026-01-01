import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createProject } from "../../lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Label } from "../../components/ui/Label"
import { Textarea } from "../../components/ui/Textarea"
import FormBuilder from "../../components/admin/FormBuilder"

const TEMPLATES = {
  singing: {
    label: "Singing Contest (歌唱比賽)",
    fields: [
      { id: "1", label: "Name (姓名)", type: "text", required: true },
      { id: "2", label: "Gender (性別)", type: "radio", options: "Male, Female", required: true },
      { id: "3", label: "Song Title (歌名)", type: "text", required: true },
      { id: "4", label: "Original Singer (原唱)", type: "text", required: true },
      { id: "5", label: "Song No. (歌曲編號)", type: "text", required: false },
      { id: "6", label: "Key (升降调)", type: "select", options: "Original, +1, +2, -1, -2", required: true },
      { id: "7", label: "Phone (電話)", type: "text", required: true },
      { id: "8", label: "Meal (便當)", type: "radio", options: "Meat, Veg", required: true },
      { id: "9", label: "Karaoke Brand (伴唱機)", type: "select", options: "弘音, 音圓, 金嗓, 瑞影, 美華", required: true },
    ]
  },
  tour: {
    label: "Bus Tour (遊覽車旅遊)",
    fields: [
      { id: "1", label: "Name (姓名)", type: "text", required: true },
      { id: "2", label: "ID Number (身分證字號)", type: "text", required: true },
      { id: "3", label: "DOB (生日)", type: "date", required: true },
      { id: "4", label: "Mobile (手機)", type: "text", required: true },
      { id: "5", label: "Emergency Contact (緊急聯絡人/電話)", type: "text", required: true },
      { id: "6", label: "Pickup Location (上車地點)", type: "radio", options: "Location A, Location B, Self", required: true },
      { id: "7", label: "Room Type (房型)", type: "select", options: "2-person, 4-person, Single (+supp)", required: true },
       { id: "8", label: "Dietary (用餐)", type: "radio", options: "Standard, Veg", required: true },
    ]
  },
  assembly: {
    label: "Member Assembly (會員大會)",
    fields: [
      { id: "1", label: "Member ID (會員編號)", type: "text", required: true },
      { id: "2", label: "Name (姓名)", type: "text", required: true },
      { id: "3", label: "Attendance (出席方式)", type: "radio", options: "In-person, Proxy, Absent", required: true },
      { id: "4", label: "Uniform Size (衣服尺寸)", type: "select", options: "XS, S, M, L, XL, 2XL", required: true },
      { id: "5", label: "Proposals (提案)", type: "textarea", required: false },
    ]
  }
}

export default function ProjectCreate() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    organizer: "",
    co_organizer: "",
    description: "",
    theme_color: "#98A697", // Default Sage
    max_participants: 100,
    fields: [],
  })

  const loadTemplate = (key) => {
    if (confirm("This will replace current fields. Continue?")) {
      setFormData(prev => ({
        ...prev,
        fields: JSON.parse(JSON.stringify(TEMPLATES[key].fields)) // Deep copy
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
      alert("Error creating project: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-morandi-dark">Create New Project</h1>
        <div className="space-x-2">
           <span className="text-sm text-morandi-muted font-medium mr-2">Quick Start:</span>
           {Object.keys(TEMPLATES).map(key => (
             <Button key={key} size="sm" variant="outline" type="button" onClick={() => loadTemplate(key)}>
               {TEMPLATES[key].label.split(" ")[0]}
             </Button>
           ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Event Title</Label>
                <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                 <Label>Max Participants</Label>
                 <Input type="number" required value={formData.max_participants} onChange={e => setFormData({...formData, max_participants: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Organizer</Label>
                <Input required value={formData.organizer} onChange={e => setFormData({...formData, organizer: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Co-Organizer</Label>
                <Input value={formData.co_organizer} onChange={e => setFormData({...formData, co_organizer: e.target.value})} />
              </div>
            </div>
            
            <div className="space-y-2">
               <Label>Description</Label>
               <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>

            <div className="space-y-2">
               <Label>Theme Color</Label>
               <div className="flex items-center gap-4">
                 <Input 
                   type="color" 
                   value={formData.theme_color} 
                   onChange={e => setFormData({...formData, theme_color: e.target.value})} 
                   className="w-20 h-10 p-1"
                 />
                 <span className="text-sm text-morandi-muted">{formData.theme_color}</span>
               </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registration Form</CardTitle>
            <CardDescription>Customize the fields participants need to fill out.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormBuilder 
              value={formData.fields} 
              onChange={fields => setFormData({...formData, fields})}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
           <Button type="button" variant="outline" onClick={() => navigate("/admin/projects")}>Cancel</Button>
           <Button type="submit" isLoading={loading}>Create Project</Button>
        </div>
      </form>
    </div>
  )
}
