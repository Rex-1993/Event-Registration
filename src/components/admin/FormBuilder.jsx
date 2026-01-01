import { useState, useEffect } from "react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Label } from "../ui/Label"
import { Select } from "../ui/Select"
import { Card, CardContent } from "../ui/Card"
import { Plus, Trash2, GripVertical } from "lucide-react"

const FIELD_TYPES = [
  { value: "text", label: "Short Text" },
  { value: "textarea", label: "Paragraph" },
  { value: "number", label: "Number" },
  { value: "email", label: "Email" },
  { value: "date", label: "Date" },
  { value: "select", label: "Dropdown" },
  { value: "radio", label: "Radio Buttons" },
  { value: "checkbox", label: "Checkbox Group" },
]

export default function FormBuilder({ value = [], onChange }) {
  const [fields, setFields] = useState(value)

  useEffect(() => {
    setFields(value)
  }, [value]) // Sync with parent if needed

  const addField = () => {
    const newField = {
      id: crypto.randomUUID(),
      label: "New Field",
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
        <Card key={field.id} className="relative group">
          <CardContent className="p-4 flex gap-4 items-start">
            <div className="mt-3 text-morandi-grey/50 cursor-grab">
              <GripVertical className="w-5 h-5" />
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 space-y-2">
                <Label>Label</Label>
                <Input 
                  value={field.label} 
                  onChange={(e) => updateField(field.id, { label: e.target.value })}
                />
              </div>

              <div className="md:col-span-3 space-y-2">
                <Label>Type</Label>
                <Select
                  value={field.type}
                  onChange={(e) => updateField(field.id, { type: e.target.value })}
                >
                  {FIELD_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </Select>
              </div>

              {/* Options field for select/radio/checkbox */}
              {["select", "radio", "checkbox"].includes(field.type) && (
                <div className="md:col-span-4 space-y-2">
                  <Label>Options (comma separated)</Label>
                  <Input 
                    value={field.options} 
                    placeholder="Option A, Option B"
                    onChange={(e) => updateField(field.id, { options: e.target.value })}
                  />
                </div>
              )}
              
              <div className="md:col-span-12 flex items-center gap-4 mt-2">
                 <label className="flex items-center gap-2 text-sm text-morandi-dark cursor-pointer">
                    <input 
                      type="checkbox"
                      className="rounded border-morandi-grey/30 text-morandi-sage focus:ring-morandi-sage"
                      checked={field.required}
                      onChange={(e) => updateField(field.id, { required: e.target.checked })}
                    />
                    Required
                 </label>
              </div>
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              className="text-red-400 hover:text-red-600 hover:bg-red-50 mt-1"
              onClick={() => removeField(field.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      ))}

      <Button onClick={addField} variant="outline" type="button" className="w-full border-dashed">
        <Plus className="w-4 h-4 mr-2" />
        Add Field
      </Button>
    </div>
  )
}
