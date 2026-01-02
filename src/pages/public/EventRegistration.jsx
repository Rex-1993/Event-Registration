import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { getProject, registerParticipant, getRegistrations } from "../../lib/api" // We check count differently now
import { Button } from "../../components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card"
import { Input } from "../../components/ui/Input"
import { Label } from "../../components/ui/Label"
import { Select } from "../../components/ui/Select"
import { Textarea } from "../../components/ui/Textarea"
import { Loader2, Search } from "lucide-react"
import BackgroundShapes from "../../components/ui/BackgroundShapes"

export default function EventRegistration() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({})
  const [isFull, setIsFull] = useState(false)
  
  // Note: In a real high-concurrency app, this check should be server-side or optimistic.
  // Here we do a client-side check on load.
  
  useEffect(() => {
    async function load() {
      try {
        const proj = await getProject(id)
        setProject(proj)
        
        // Check capacity
        // This is not efficient for huge lists, but fine for <1000
        const regs = await getRegistrations(id)
        if (parseInt(proj.max_participants) !== 0 && regs.length >= parseInt(proj.max_participants)) {
          setIsFull(true)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await registerParticipant(id, formData)
      navigate("/success", { state: { projectTitle: project.title } })
    } catch (error) {
      alert(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (fieldId, value) => {
     setFormData(prev => ({
       ...prev,
       [fieldId]: value
     }))
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-600 h-8 w-8" /></div>
  if (!project) return <div className="text-center py-20 text-neutral-500">找不到專案</div>

  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] font-sans relative overflow-x-hidden pb-20">
      {/* Dynamic Background Decoration */}
      <BackgroundShapes themeColor={project?.theme_color || "#6366f1"} density={8} />

      {/* Hero Section */}
      <div 
        className="relative w-full h-[320px] shadow-lg flex flex-col items-center justify-center text-center px-4 pt-10 pb-20"
        style={{ 
          background: `linear-gradient(135deg, ${project.theme_color}, ${project.theme_color}dd, #637080)`
        }}
      >
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"></div>
        <div className="relative z-10 space-y-4 max-w-4xl mx-auto animate-in slide-in-from-top-6 duration-700">
           <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
             {project.title}
           </h1>
           <p className="text-white/90 text-lg md:text-xl font-medium max-w-2xl mx-auto drop-shadow-sm">
             {project.organizer} {project.co_organizer && `| ${project.co_organizer}`}
           </p>
        </div>
      </div>

      {/* Content Container (Overlapping Hero) */}
      <div className="container mx-auto px-4 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
           {/* Left Column: Info & Description */}
           <div className="lg:col-span-1 space-y-6 animate-in slide-in-from-left-6 duration-700 delay-100">
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-md overflow-hidden">
                <CardHeader className="bg-neutral-50/80 border-b border-neutral-100 pb-4">
                  <CardTitle className="text-lg text-neutral-800 flex items-center gap-2">
                    <Search className="w-5 h-5 text-primary-500" />
                    活動詳情
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 text-neutral-600 space-y-6">
                   <p className="whitespace-pre-line leading-relaxed text-sm md:text-base break-words">
                      {project.description}
                   </p>
                   <div className="pt-4 border-t border-neutral-100">
                      <Link to={`/event/${id}/check`} className="block">
                        <Button variant="outline" className="w-full text-primary-600 hover:text-primary-700 border-primary-200 hover:bg-primary-50">
                          查詢報名狀態
                        </Button>
                      </Link>
                   </div>
                </CardContent>
              </Card>
           </div>

           {/* Right Column: Registration Form */}
           <div className="lg:col-span-2 animate-in slide-in-from-bottom-6 duration-700 delay-200">
             <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-xl ring-1 ring-black/5">
                <CardHeader className="pb-6 border-b border-neutral-100/50">
                  <CardTitle className="text-2xl text-neutral-800 flex items-center gap-2">
                    <span className="w-2 h-8 rounded-full" style={{ backgroundColor: project.theme_color }}></span>
                    填寫報名表
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                     {isFull ? (
                       <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 text-red-600 font-bold border border-red-100">
                         ⚠️ 名額已滿，報名已截止
                       </span>
                     ) : (
                       "請準確填寫您的資料，標註 * 為必填欄位。"
                     )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-8 px-6 md:px-10">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {project.fields.map(field => {
                      const commonProps = {
                        required: field.required,
                        disabled: isFull,
                        value: formData[field.id] || "",
                        onChange: (e) => handleChange(field.id, e.target.value),
                        className: "focus:ring-2 focus:ring-offset-0 transition-shadow duration-200 bg-neutral-50/50 hover:bg-white border-neutral-200"
                      }
                      
                      const focusStyle = { '--tw-ring-color': project.theme_color }

                      return (
                        <div key={field.id} className="space-y-3 group" style={focusStyle}>
                          <Label className="text-base font-medium text-neutral-700 group-hover:text-neutral-900 transition-colors">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1 font-bold">*</span>}
                          </Label>

                          {field.type === "textarea" ? (
                            <Textarea {...commonProps} placeholder={`請輸入${field.label}...`} className={`${commonProps.className} min-h-[120px]`} />
                          ) : field.type === "select" ? (
                            <div className="relative">
                                <Select {...commonProps}>
                                  <option value="">請選擇...</option>
                                  {field.options.split(",").map(opt => (
                                    <option key={opt.trim()} value={opt.trim()}>{opt.trim()}</option>
                                  ))}
                                </Select>
                            </div>
                          ) : field.type === "radio" ? (
                            <div className="flex flex-wrap gap-3 pt-1">
                              {field.options.split(",").map(opt => (
                                <label key={opt.trim()} className="group/radio relative flex items-center space-x-3 cursor-pointer p-3 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all">
                                  <input
                                    type="radio"
                                    name={field.id}
                                    value={opt.trim()}
                                    checked={formData[field.id] === opt.trim()}
                                    onChange={(e) => handleChange(field.id, e.target.value)}
                                    disabled={isFull}
                                    className="peer sr-only"
                                    required={field.required}
                                  />
                                  <div 
                                    className="w-5 h-5 rounded-full border border-neutral-300 peer-checked:border-transparent peer-checked:bg-current relative flex items-center justify-center transition-all"
                                    style={{ color: project.theme_color }}
                                  >
                                     <div className="w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transform scale-0 peer-checked:scale-100 transition-all"></div>
                                  </div>
                                  <span className="text-sm font-medium text-neutral-700 group-hover/radio:text-neutral-900">{opt.trim()}</span>
                                  <div className="absolute inset-0 rounded-xl ring-2 ring-transparent peer-checked:ring-offset-0 transition-all pointer-events-none" style={{ '--tw-ring-color': project.theme_color, boxShadow: formData[field.id] === opt.trim() ? `0 0 0 2px ${project.theme_color}` : 'none' }}></div>
                                </label>
                              ))}
                            </div>
                          ) : (
                            <Input type={field.type} {...commonProps} placeholder={`請輸入${field.label}...`} />
                          )}
                        </div>
                      )
                    })}

                    <div className="pt-8 pb-4">
                      <Button 
                        type="submit" 
                        className="w-full text-lg h-14 font-bold shadow-lg shadow-neutral-200 hover:shadow-xl hover:shadow-neutral-300 transition-all hover:-translate-y-1 rounded-xl" 
                        style={{ backgroundColor: isFull ? undefined : project.theme_color }}
                        disabled={isFull || submitting}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            資料處理中...
                          </>
                        ) : isFull ? (
                          "報名已截止"
                        ) : (
                          "確認送出報名"
                        )}
                      </Button>
                      <p className="text-center text-xs text-neutral-400 mt-4">
                        提交即代表您同意我們收集並處理您的個人資料
                      </p>
                    </div>
                  </form>
                </CardContent>
             </Card>
           </div>
        </div>
      </div>
    </div>
  )
}
