import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { getProject, registerParticipant, getRegistrations, checkDuplicate } from "../../lib/api"
import { getContrastYIQ } from "../../lib/utils"
import { Button } from "../../components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card"
import { Input } from "../../components/ui/Input"
import { Label } from "../../components/ui/Label"
import { Select } from "../../components/ui/Select"
import { Textarea } from "../../components/ui/Textarea"
import { Loader2, Search, Info, X, UserCheck } from "lucide-react"
import BackgroundShapes from "../../components/ui/BackgroundShapes"

// Curve Generator Component
function DynamicCurves({ color }) {
  const curves = useState(() => {
    const curveCount = 8; // Fewer curves for cleaner look
    return Array.from({ length: curveCount }).map((_, i) => {
      const startY = Math.random() * 100;
      const endY = Math.random() * 100;
      const cp1x = 20 + Math.random() * 30; 
      const cp1y = Math.random() * 100;
      const cp2x = 50 + Math.random() * 30; 
      const cp2y = Math.random() * 100;
      
      return {
        id: i,
        d: `M 0 ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, 100 ${endY}`,
        strokeWidth: 3 + Math.random() * 12, // Thicker lines
        opacity: 0.15 + Math.random() * 0.25 // More visible opacity
      };
    });
  })[0];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-b-[3rem]">
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
               mixBlendMode: 'overlay', // Keep overlay for color blending
            }}
          />
        ))}
      </svg>
    </div>
  );
}

function ActivityDetailsModal({ isOpen, onClose, title, description, projectTheme }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
           <h3 className="font-bold text-xl text-neutral-800 flex items-center gap-2">
             <Info className="w-5 h-5 text-primary-500" style={{ color: projectTheme }} />
             活動詳情
           </h3>
           <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-neutral-100 rounded-full w-8 h-8">
             <X className="w-5 h-5 text-neutral-500" />
           </Button>
        </div>
        
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
           <h4 className="text-2xl font-bold mb-6 text-neutral-900">{title}</h4>
           {/* Added whitespace-pre-wrap and break-words for proper text wrapping */}
           <div className="prose prose-neutral max-w-none text-neutral-600 whitespace-pre-wrap break-words leading-relaxed">
             {description}
           </div>
        </div>

        <div className="p-4 border-t border-neutral-100 bg-neutral-50 text-right">
           <Button onClick={onClose} variant="outline">關閉</Button>
        </div>
      </div>
    </div>
  )
}

function CheckRegistrationModal({ isOpen, onClose, projectId, projectTheme }) {
  const [name, setName] = useState("")
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setName("")
      setResults(null)
    }
  }, [isOpen])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    
    setLoading(true)
    try {
      const data = await checkDuplicate(projectId, name.trim())
      setResults(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
         <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
           <h3 className="font-bold text-xl text-neutral-800 flex items-center gap-2">
             <Search className="w-5 h-5" style={{ color: projectTheme }} />
             報名狀態查詢
           </h3>
           <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-neutral-100 rounded-full w-8 h-8">
             <X className="w-5 h-5 text-neutral-500" />
           </Button>
         </div>

         <div className="p-6">
            <p className="text-neutral-500 text-sm mb-4">請輸入您的完整姓名以查詢是否已報名成功。</p>
            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
              <Input 
                placeholder="例: 王小明" 
                value={name} 
                onChange={e => setName(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" isLoading={loading} className="text-white border-0 shadow-sm" style={{ backgroundColor: projectTheme }}>
                <Search className="w-4 h-4" />
              </Button>
            </form>

            {results && (
              <div className="space-y-4 animate-in slide-in-from-bottom-2 fade-in duration-300">
                <h4 className="font-medium text-neutral-900 border-b pb-2 text-sm">查詢結果</h4>
                {results.length === 0 ? (
                  <div className="p-4 bg-neutral-50 rounded-lg text-neutral-500 text-center text-sm border border-dashed border-neutral-200">
                    找不到 "{name}" 的資料
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                    {results.map((res, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50/50 border border-green-200 rounded-lg text-green-800">
                         <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-green-100 rounded-full">
                              <UserCheck className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <span className="font-bold block text-sm">{res.name}</span>
                              <span className="text-[10px] text-green-600/80">已報名</span>
                            </div>
                         </div>
                         <span className="text-xs font-medium bg-white/60 px-2 py-0.5 rounded border border-green-100">{res.registered_at.split(' ')[0]}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
         </div>
      </div>
    </div>
  )
}

export default function EventRegistration() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({})
  const [isFull, setIsFull] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showCheckStatus, setShowCheckStatus] = useState(false)
  
  useEffect(() => {
    async function load() {
      try {
        const proj = await getProject(id)
        setProject(proj)
        
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
  
  const themeColor = project.theme_color || "#6366f1";
  const textColor = getContrastYIQ(themeColor);

  return (
    <div className="min-h-screen w-full font-sans relative overflow-x-hidden pb-20">
      {/* Fixed Background Layer - Using a 12% opacity of theme color for a deeper feel while keeping text readable, on top of white */}
      <div className="fixed inset-0 -z-30 bg-white"></div>
      <div 
        className="fixed inset-0 -z-20 transition-colors duration-700" 
        style={{ backgroundColor: `${themeColor}1f` }} // 1f is approx 12% opacity
      ></div>

      {/* Dynamic Background Decoration */}
      <BackgroundShapes themeColor={themeColor} density={15} />

      {/* Hero Section */}
      <div 
        className="relative w-full h-[450px] shadow-lg flex flex-col items-center justify-center text-center px-4 pt-10 pb-24 rounded-b-[3rem] overflow-hidden transition-all duration-700"
        style={{ 
          background: themeColor,  // Solid background to prevent see-through
          color: textColor
        }}
      >
        {/* Helper gradient for depth but kept opaque-ish */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10 pointer-events-none"></div>

        {/* Dynamic Random Curves Background - Only on this header block */}
        <DynamicCurves color={textColor} />
        
        <div className="relative z-10 space-y-6 max-w-4xl mx-auto flex flex-col items-center">
           <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-md leading-tight" style={{ color: textColor }}>
             {project.title}
           </h1>
           
           <div className="flex flex-wrap gap-4 justify-center">
             <Button 
                variant="outline" 
                onClick={() => setShowDetails(true)}
                className="bg-white/20 hover:bg-white/30 border-white/40 text-white backdrop-blur-md rounded-full px-6 transition-all hover:scale-105"
                style={{ color: textColor, borderColor: textColor ? `${textColor}60` : undefined }}
             >
               <Info className="w-4 h-4 mr-2" />
               查看活動詳情
             </Button>

             <Button 
                variant="outline" 
                onClick={() => setShowCheckStatus(true)}
                className="bg-white/20 hover:bg-white/30 border-white/40 text-white backdrop-blur-md rounded-full px-6 transition-all hover:scale-105"
                style={{ color: textColor, borderColor: textColor ? `${textColor}60` : undefined }}
             >
               <Search className="w-4 h-4 mr-2" />
               報名狀態查詢
             </Button>
           </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 -mt-20 relative z-20">
        <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-6 duration-700 delay-200">
             <Card className="border-0 shadow-2xl shadow-indigo-500/10 bg-white/95 backdrop-blur-xl ring-1 ring-black/5 rounded-3xl">
                <CardHeader className="pb-6 border-b border-neutral-100/50">
                  <CardTitle className="text-2xl text-neutral-800 flex items-center gap-2">
                    <span className="w-1.5 h-8 rounded-full" style={{ backgroundColor: project.theme_color }}></span>
                    填寫報名表
                  </CardTitle>
                  <CardDescription className="text-base mt-2 pl-4">
                     {isFull ? (
                       <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 text-red-600 font-bold border border-red-100">
                         ⚠️ 名額已滿，報名已截止
                       </span>
                     ) : (
                       "請準確填寫您的資料，標註 * 為必填欄位。"
                     )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-8 px-4 md:px-10">
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
                          <Label className="text-base font-medium text-neutral-700 group-hover:text-neutral-900 transition-colors pl-1">
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
                                <label key={opt.trim()} className="group/radio relative flex items-center space-x-3 cursor-pointer p-3 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all select-none">
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
                            : `linear-gradient(135deg, #f97316, #ea580c)`,
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

      {/* Organizer Info Footer */}
      <div className="container mx-auto px-4 mt-16 mb-12 text-center animate-in fade-in duration-700 delay-300 relative z-10">
        <div className="inline-block p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm space-y-3 max-w-lg w-full">
            <p className="text-neutral-700 text-lg">
              <span className="font-bold text-neutral-500 text-sm block mb-1">主辦單位</span>
              {project.organizer}
            </p>
            {project.co_organizer && (
              <div className="pt-3 border-t border-neutral-200/50">
                <p className="text-neutral-600">
                  <span className="font-bold text-neutral-400 text-xs mr-2">協辦單位</span>
                  {project.co_organizer}
                </p>
              </div>
            )}
        </div>
      </div>
      
      {/* Details Modal */}
      <ActivityDetailsModal 
        isOpen={showDetails} 
        onClose={() => setShowDetails(false)} 
        title={project.title}
        description={project.description}
        projectTheme={project.theme_color}
      />

      {/* Check Status Modal */}
      <CheckRegistrationModal 
        isOpen={showCheckStatus}
        onClose={() => setShowCheckStatus(false)}
        projectId={id}
        projectTheme={project.theme_color}
      />
    </div>
  )
}

