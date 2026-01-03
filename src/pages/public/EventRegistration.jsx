import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { getProject, registerParticipant, getRegistrations } from "../../lib/api" // We check count differently now
import { getContrastYIQ } from "../../lib/utils"
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
      navigate("/success", { state: { projectTitle: project.title, projectId: id } })
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

  const textColor = getContrastYIQ(project.theme_color);

  return (
    <div className="min-h-screen w-full font-sans relative overflow-x-hidden pb-20">
      {/* Fixed Background Layer */}
      <div className="fixed inset-0 bg-[#f8f9fa] -z-20"></div>

      {/* Dynamic Background Decoration */}
      <BackgroundShapes themeColor={project?.theme_color || "#6366f1"} density={15} />

      {/* Hero Section */}
// Curve Generator Component
function DynamicCurves({ color }) {
  // Use unique seed or just random on mount. Since we want consistency during session, useMemo with dependency [] is enough.
  const curves = useState(() => {
    const curveCount = 12;
    return Array.from({ length: curveCount }).map((_, i) => {
      // Random control points for cubic bezier
      const startY = Math.random() * 100;
      const endY = Math.random() * 100;
      const cp1x = Math.random() * 50; 
      const cp1y = Math.random() * 100;
      const cp2x = 50 + Math.random() * 50; 
      const cp2y = Math.random() * 100;
      
      return {
        id: i,
        d: `M 0 ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, 100 ${endY}`,
        width: 2 + Math.random() * 10, // stroke width 2-12 (relative to coordinate system? No, absolute typically better, but here using percent coords)
        // actually for SVG with viewBox 0 0 100 100, these are thin. Let's assume viewbox 0 0 100 100 and use small widths
        strokeWidth: 0.2 + Math.random() * 1.5,
        opacity: 0.1 + Math.random() * 0.3
      };
    });
  })[0];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {curves.map((curve) => (
          <path
            key={curve.id}
            d={curve.d}
            fill="none"
            stroke={color === 'white' ? 'white' : 'black'}
            strokeWidth={curve.strokeWidth}
            strokeOpacity={curve.opacity}
            strokeLinecap="round"
            style={{
               mixBlendMode: 'overlay',
               filter: 'blur(0.5px)'
            }}
          />
        ))}
      </svg>
    </div>
  );
}

// ... inside main component render ...

      <div 
        className="relative w-full h-[400px] shadow-lg flex flex-col items-center justify-center text-center px-4 pt-10 pb-24 rounded-b-[3rem] overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${project.theme_color}, ${project.theme_color}dd)`,
          color: textColor
        }}
      >
        {/* Dynamic Random Curves Background */}
        <DynamicCurves color={textColor} />
        
        <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] rounded-b-[3rem]"></div>
        
        <div className="relative z-10 space-y-4 max-w-5xl mx-auto animate-in slide-in-from-top-6 duration-700">
           <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-md leading-tight" style={{ color: textColor }}>
             {project.title}
           </h1>
        </div>
      </div>

      {/* Content Container (Overlapping Hero) */}
      <div className="container mx-auto px-4 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
           {/* Left Column: Info & Description */}
           <div className="lg:col-span-1 space-y-6 animate-in slide-in-from-left-6 duration-700 delay-100">
              <Card className="border-0 shadow-xl shadow-black/5 bg-white/80 backdrop-blur-md overflow-hidden rounded-3xl ring-1 ring-black/5">
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
             <Card className="border-0 shadow-2xl shadow-indigo-500/10 bg-white/95 backdrop-blur-xl ring-1 ring-black/5 rounded-3xl">
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
                <CardContent className="pt-8 px-4 md:px-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {project.fields.map(field => {
                      const commonProps = {
                        required: field.required,
                        disabled: isFull,
                        value: formData[field.id] || "",
                        onChange: (e) => handleChange(field.id, e.target.value),
                        className: "focus:ring-2 focus:ring-offset-0 transition-all duration-300 bg-neutral-50/60 hover:bg-white border-neutral-200 rounded-xl focus:shadow-md"
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
                        className="w-full text-lg h-14 font-bold shadow-lg shadow-neutral-400/20 hover:shadow-xl hover:shadow-neutral-400/40 transition-all hover:-translate-y-1 rounded-xl text-white border-0" 
                        style={{ 
                          background: isFull 
                            ? undefined 
                            : `linear-gradient(135deg, #f97316, #ea580c)`, // Orange-500 to Orange-600
                        }}
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

                    </div>
                  </form>
                </CardContent>
             </Card>
           </div>
        </div>
      </div>

      {/* Organizer Info Footer */}
      <div className="container mx-auto px-4 mt-12 mb-8 text-center animate-in fade-in duration-700 delay-300 relative z-10">
        <div className="inline-block p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm space-y-2 max-w-lg w-full">
            <p className="text-neutral-700 text-lg">
              <span className="font-bold text-neutral-500 text-sm block mb-1">主辦單位</span>
              {project.organizer}
            </p>
            {project.co_organizer && (
              <div className="pt-2 mt-2 border-t border-neutral-200/50">
                <p className="text-neutral-600">
                  <span className="font-bold text-neutral-400 text-xs mr-2">協辦單位</span>
                  {project.co_organizer}
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}
