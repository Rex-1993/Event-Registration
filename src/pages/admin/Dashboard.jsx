import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getProjects, deleteProject, createProject, getRegistrations, updateProjectOrder } from "../../lib/api"
import { Button } from "../../components/ui/Button"
import { Card, CardContent } from "../../components/ui/Card"
import { Plus, Users, Calendar, ArrowRight, Trash2, Edit, Copy, Link as LinkIcon, GripVertical } from "lucide-react"
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
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
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableProjectRow({ project, counts, onDelete, onCopy, onCopyLink }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: 'relative',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`group bg-white/80 backdrop-blur-sm border border-neutral-200 rounded-xl mb-3 shadow-sm hover:shadow-md transition-all ${isDragging ? 'shadow-xl ring-2 ring-primary-500 opacity-90' : ''}`}
    >
      <div className="flex items-center p-4 gap-4">
        {/* Drag Handle */}
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-2 text-neutral-400 hover:text-neutral-600 touch-none">
          <GripVertical className="w-5 h-5" />
        </div>

        {/* Color Indicator */}
        <div className="w-1.5 h-12 rounded-full hidden sm:block" style={{ backgroundColor: project.theme_color }}></div>

        {/* content */}
        <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
             {/* Title & Desc */}
             <div className="md:col-span-5 pr-4">
               <h3 className="font-bold text-lg text-neutral-800 truncate">{project.title}</h3>
               <p className="text-sm text-neutral-500 truncate">{project.description}</p>
             </div>

             {/* Stats */}
             <div className="md:col-span-3 flex items-center md:justify-center">
                <div className="bg-neutral-50 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm border border-neutral-100">
                  <span className="font-medium text-green-700 flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {counts[project.id] !== undefined ? counts[project.id] : '...'}
                  </span>
                  <span className="text-neutral-400">/</span>
                  <span className="text-neutral-600">
                    {parseInt(project.max_participants) === 0 ? "無限制" : project.max_participants}
                  </span>
                </div>
             </div>

             {/* Actions */}
             <div className="md:col-span-4 flex items-center md:justify-end gap-2">
                <Button 
                   variant="ghost" 
                   size="icon" 
                   onClick={(e) => onCopyLink(e, project)}
                   className="h-9 w-9 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50"
                   title="複製連結"
                >
                   <LinkIcon className="w-4 h-4" />
                </Button>
                <Button 
                   variant="ghost" 
                   size="icon" 
                   onClick={(e) => onCopy(e, project)}
                   className="h-9 w-9 text-neutral-400 hover:text-green-600 hover:bg-green-50"
                   title="複製專案"
                >
                   <Copy className="w-4 h-4" />
                </Button>
                <Link to={`/admin/projects/${project.id}/edit`}>
                   <Button 
                     variant="ghost" 
                     size="icon" 
                     className="h-9 w-9 text-neutral-400 hover:text-blue-600 hover:bg-blue-50"
                     title="編輯"
                   >
                     <Edit className="w-4 h-4" />
                   </Button>
                </Link>
                <Button 
                   variant="ghost" 
                   size="icon" 
                   onClick={(e) => onDelete(e, project.id, project.title)}
                   className="h-9 w-9 text-neutral-400 hover:text-red-600 hover:bg-red-50"
                   title="刪除"
                >
                   <Trash2 className="w-4 h-4" />
                </Button>
                
                <div className="w-px h-6 bg-neutral-200 mx-1"></div>

                <Link to={`/admin/projects/${project.id}`}>
                   <Button variant="outline" className="h-9 px-4 text-sm gap-1 hover:border-primary-300 hover:text-primary-700">
                     <span>詳情</span>
                     <ArrowRight className="w-3 h-3" />
                   </Button>
                </Link>
             </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [counts, setCounts] = useState({})
  
  // Dnd Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
        activationConstraint: {
            delay: 250, // Long press for touch
            tolerance: 5,
        },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    if (projects.length > 0) {
      projects.forEach(async (p) => {
         try {
           const regs = await getRegistrations(p.id)
           setCounts(prev => ({ ...prev, [p.id]: regs.length }))
         } catch (e) {
           console.error("Failed to load count for", p.id)
         }
      })
    }
  }, [projects?.length]) // Only refetch counts if project array size changes initially

  const fetchProjects = async () => {
    try {
      const data = await getProjects()
      setProjects(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setProjects((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        
        const newOrder = arrayMove(items, oldIndex, newIndex);
        
        // Save new order to backend (fire and forget optimistically)
        updateProjectOrder(newOrder).catch(err => {
            console.error("Failed to save order", err);
            // Optionally revert on error but for simple sorting optimistic is fine
        });
        
        return newOrder;
      });
    }
  }

  const handleDelete = async (e, id, title) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm(`確定要刪除專案「${title}」嗎？此動作無法復原。`)) {
      try {
        await deleteProject(id)
        fetchProjects()
      } catch (error) {
        alert("刪除專案時發生錯誤: " + error.message)
      }
    }
  }

  const handleCopy = async (e, project) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm(`確定要複製專案「${project.title}」嗎？`)) {
       try {
         const { id, created_at, ...projectData } = project
         const newProject = {
           ...projectData,
           title: `${project.title} (副本)`
         }
         await createProject(newProject)
         fetchProjects() // Refresh list
       } catch (error) {
         alert("複製專案時發生錯誤: " + error.message)
       }
    }
  }

  const handleCopyLink = (e, project) => {
    e.preventDefault()
    e.stopPropagation()
    const url = `${window.location.origin}${window.location.pathname}#/event/${project.id}`
    navigator.clipboard.writeText(url)
    alert("問卷連結已複製到剪貼簿！")
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative max-w-6xl mx-auto">
      <div className="flex justify-between items-end border-b border-neutral-200 pb-6 relative z-10">
        <div>
           <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">問卷管理</h1>
           <p className="text-neutral-500 mt-1">管理您的活動報名專案 (可拖曳排序)</p>
        </div>
        <Link to="/admin/projects/create">
          <Button className="gap-2 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0">
            <Plus className="w-4 h-4" />
            建立新專案
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-neutral-400 flex flex-col items-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full mb-4"></div>
          載入專案中...
        </div>
      ) : projects.length === 0 ? (
        <Card className="text-center py-20 border-dashed border-2 bg-neutral-50/50 shadow-none">
          <CardContent>
             <p className="text-xl text-neutral-500 mb-6 font-medium">目前沒有任何專案</p>
             <Link to="/admin/projects/create">
                <Button variant="outline" className="h-12 px-6">建立您的第一個專案</Button>
             </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="relative z-10">
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={projects.map(p => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3 pb-20">
                    {projects.map(project => (
                        <SortableProjectRow 
                            key={project.id} 
                            project={project} 
                            counts={counts}
                            onDelete={handleDelete}
                            onCopy={handleCopy}
                            onCopyLink={handleCopyLink}
                        />
                    ))}
                </div>
              </SortableContext>
            </DndContext>
        </div>
      )}
    </div>
  )
}
