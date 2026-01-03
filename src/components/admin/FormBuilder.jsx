import { useState, useEffect } from "react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Label } from "../ui/Label"
import { Select } from "../ui/Select"
import { Card, CardContent } from "../ui/Card"
import { Plus, Trash2, GripVertical } from "lucide-react"

import {
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor, // Changed from Mouse/Touch to Pointer
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';

// ... (imports remain)

export default function FormBuilder({ value = [], onChange }) {
  const [fields, setFields] = useState(value)
  useEffect(() => {
    setFields(value)
  }, [value])

  // Configure sensors for interaction handling
  // Using PointerSensor with distance constraint is the most robust way to handle both mouse and touch without conflicts
  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: {
            distance: 5, 
        },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

// ... (rest of FormBuilder remains until SortableField)

function SortableField({ field, updateField, removeField }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 999 : "auto",
    position: "relative",
  };

  return (
    // Only setNodeRef and style here. No attributes or listeners!
    <div ref={setNodeRef} style={style} className="mb-4">
      <Card className={`relative group hover:border-primary-200 transition-colors ${isDragging ? 'border-primary-500 ring-2 ring-primary-200 shadow-xl' : ''}`}>
        <CardContent className="p-4 flex gap-4 items-start">
          <div 
            ref={setActivatorNodeRef}
            className="mt-3 text-orange-500 p-2 rounded cursor-grab active:cursor-grabbing hover:bg-orange-50 hover:text-orange-600 transition-colors touch-none"
            title="拖曳以排序"
            {...attributes} // Attributes moved here
            {...listeners}  // Listeners stay here
          >
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
    </div>
  );
}
