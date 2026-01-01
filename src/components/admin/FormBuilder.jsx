import { useState, useEffect } from "react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Label } from "../ui/Label"
import { Select } from "../ui/Select"
import { Card, CardContent } from "../ui/Card"
import { Plus, Trash2, GripVertical } from "lucide-react"

const FIELD_TYPES = [
  { value: "text", label: "簡短回答" },
  { value: "textarea", label: "詳細回答" },
  { value: "number", label: "數字" },
  { value: "email", label: "電子郵件" },
  { value: "date", label: "日期" },
  { value: "select", label: "下拉式選單" },
  { value: "radio", label: "單選題" },
  { value: "checkbox", label: "多選題" },
]

export default function FormBuilder({ value = [], onChange }) {
  const [fields, setFields] = useState(value)

  useEffect(() => {
    setFields(value)
  }, [value]) // Sync with parent if needed

  const addField = () => {
    const newField = {
      id: crypto.randomUUID(),
      label: "新問題",
      type: "text",
      required: false,
      options: "" // For select/radio
    }
    const newFields = [...fields, newField]
    setFields(newFields)
    onChange(newFields)
  }

  const updateField = (id, updates) => {
    const newFields = fields.map(f => f.id === id ? { ...f, ...updates } : f)
    setFields(newFields)
    onChange(newFields)
  }

  const removeField = (id) => {
    const newFields = fields.filter(f => f.id !== id)
    setFields(newFields)
    onChange(newFields)
  }

  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <Card key={field.id} className="relative group hover:border-primary-200 transition-colors">
          <CardContent className="p-4 flex gap-4 items-start">
            <div className="mt-3 text-neutral-400 cursor-move hover:text-primary-500">
              <GripVertical className="w-5 h-5" />
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 space-y-2">
                <Label>標題</Label>
                <Input 
                  value={field.label} 
                  onChange={(e) => updateField(field.id, { label: e.target.value })}
                  placeholder="請輸入問題標題"
                  className="focus:ring-primary-500"
                />
              </div>

              <div className="md:col-span-3 space-y-2">
                <Label>類型</Label>
                <Select
                  value={field.type}
                  onChange={(e) => updateField(field.id, { type: e.target.value })}
                  className="focus:ring-primary-500"
                >
                  {FIELD_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </Select>
              </div>

              {/* Options field for select/radio/checkbox */}
              {["select", "radio", "checkbox"].includes(field.type) && (
                <div className="md:col-span-4 space-y-2">
                  <Label>選項 (以逗號分隔)</Label>
                  <Input 
                    value={field.options} 
                    placeholder="選項A, 選項B, 選項C"
                    onChange={(e) => updateField(field.id, { options: e.target.value })}
                    className="focus:ring-primary-500"
                  />
                </div>
              )}
              
              <div className="md:col-span-12 flex items-center gap-4 mt-2">
                 <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer hover:text-primary-600 transition-colors">
                    <input 
                      type="checkbox"
                      className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                      checked={field.required}
                      onChange={(e) => updateField(field.id, { required: e.target.checked })}
                    />
                    必填
                 </label>
              </div>
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              className="text-neutral-400 hover:text-red-600 hover:bg-red-50 mt-1 transition-colors"
              onClick={() => removeField(field.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      ))}

      <Button onClick={addField} variant="outline" type="button" className="w-full border-dashed border-2 py-6 text-neutral-500 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50/50 transition-all">
        <Plus className="w-4 h-4 mr-2" />
        新增問題
      </Button>
    </div>
  )
}
