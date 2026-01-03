import { useState, useEffect } from "react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Label } from "../ui/Label"
import { Select } from "../ui/Select"
import { Card, CardContent } from "../ui/Card"
import { Plus, Trash2, GripVertical } from "lucide-react"

import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

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

  // Configure sensors for interaction handling
  const sensors = useSensors(
    useSensor(MouseSensor, {
        activationConstraint: {
            distance: 5, 
        },
    }),
    useSensor(TouchSensor, {
        activationConstraint: {
            delay: 0, // Instant drag since we are using a dedicated handle
            tolerance: 5, 
        },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addField = () => {
    const newField = {
      id: crypto.randomUUID(),
      label: "新問題",
      type: "text",
      required: false,
      options: "" 
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

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        onChange(newItems); // Sync with parent immediately
        return newItems;
      });
    }
  }

  return (
    <div className="space-y-4">
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext 
          items={fields.map(f => f.id)}
          strategy={verticalListSortingStrategy}
        >
          {fields.map((field) => (
            <SortableField 
                key={field.id} 
                field={field} 
                updateField={updateField} 
                removeField={removeField} 
            />
          ))}
        </SortableContext>
      </DndContext>

      <Button onClick={addField} variant="outline" type="button" className="w-full border-dashed border-2 py-6 text-neutral-500 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50/50 transition-all">
        <Plus className="w-4 h-4 mr-2" />
        新增問題
      </Button>
    </div>
  )
}

function SortableField({ field, updateField, removeField }) {
  const {
    attributes,
    listeners,
    setNodeRef,
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
    <div ref={setNodeRef} style={style} className="mb-4 touch-manipulation" {...attributes}>
      <Card className={`relative group hover:border-primary-200 transition-colors ${isDragging ? 'border-primary-500 ring-2 ring-primary-200 shadow-xl' : ''}`}>
        <CardContent className="p-4 flex gap-4 items-start">
          <div 
            className="mt-3 text-neutral-400 p-2 rounded cursor-grab active:cursor-grabbing hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
            title="拖曳以排序"
            {...listeners}
          >
            <GripVertical className="w-5 h-5" />
          </div>
          
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
