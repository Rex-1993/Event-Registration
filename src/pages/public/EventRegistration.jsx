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
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight">{project.title}</h1>
          <div 
            className="h-1.5 w-24 mx-auto rounded-full shadow-sm" 
            style={{ backgroundColor: project.theme_color }}
          />
        </div>
        <p className="text-neutral-600 max-w-2xl mx-auto whitespace-pre-line leading-relaxed text-lg break-words px-2 text-left">
           {project.description}
        </p>

        <Link to={`/event/${id}/check`}>
          <Button variant="ghost" className="text-primary-600 hover:text-primary-700 hover:bg-primary-50">
            <Search className="w-4 h-4 mr-2" />
            查詢是否已報名
          </Button>
        </Link>
      </div>

      <Card className="max-w-2xl mx-auto shadow-xl border-t-4 overflow-hidden" style={{ borderTopColor: project.theme_color }}>
        <CardHeader className="bg-neutral-50/50 pb-8">
          <CardTitle className="text-2xl">報名表單</CardTitle>
          <CardDescription className="text-base mt-2">
             {isFull ? (
               <span className="text-red-600 font-bold flex items-center gap-2">
                 ⚠️ 名額已滿，報名已截止
               </span>
             ) : (
               "請準確填寫您的資料，標註 * 為必填欄位。"
             )}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {project.fields.map(field => {
              const commonProps = {
                required: field.required,
                disabled: isFull,
                value: formData[field.id] || "",
                onChange: (e) => handleChange(field.id, e.target.value)
              }

              return (
                <div key={field.id} className="space-y-3 group">
                  <Label className="text-base text-neutral-700 group-hover:text-primary-700 transition-colors">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>

                  {field.type === "textarea" ? (
                    <Textarea {...commonProps} placeholder={`請輸入${field.label}...`} />
                  ) : field.type === "select" ? (
                    <Select {...commonProps}>
                       <option value="">請選擇...</option>
                       {field.options.split(",").map(opt => (
                         <option key={opt.trim()} value={opt.trim()}>{opt.trim()}</option>
                       ))}
                    </Select>
                  ) : field.type === "radio" ? (
                    <div className="flex flex-wrap gap-4 pt-1">
                      {field.options.split(",").map(opt => (
                        <label key={opt.trim()} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-neutral-50 transition-colors border border-transparent hover:border-neutral-200">
                          <input
                            type="radio"
                            name={field.id}
                            value={opt.trim()}
                            checked={formData[field.id] === opt.trim()}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            disabled={isFull}
                            className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                            required={field.required}
                          />
                          <span className="text-sm text-neutral-700">{opt.trim()}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <Input type={field.type} {...commonProps} placeholder={`請輸入${field.label}...`} />
                  )}
                </div>
              )
            })}

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full text-lg h-14 font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5" 
                style={{ backgroundColor: isFull ? undefined : project.theme_color }}
                disabled={isFull || submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    處理中...
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
      
      <div className="text-center text-sm text-neutral-400 font-medium">
         主辦單位: {project.organizer}
         {project.co_organizer && ` | 協辦單位: ${project.co_organizer}`}
      </div>
    </div>
  )
}
