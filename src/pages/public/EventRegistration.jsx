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
        if (regs.length >= parseInt(proj.max_participants)) {
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

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-morandi-sage" /></div>
  if (!project) return <div className="text-center py-20">Project not found</div>

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-morandi-dark">{project.title}</h1>
        <div 
          className="h-2 w-24 mx-auto rounded-full" 
          style={{ backgroundColor: project.theme_color }}
        />
        <p className="text-morandi-muted max-w-lg mx-auto whitespace-pre-line">
           {project.description}
        </p>

        <Link to={`/event/${id}/check`}>
          <Button variant="ghost" className="text-morandi-sage hover:text-morandi-sage/80 hover:bg-morandi-sage/10">
            <Search className="w-4 h-4 mr-2" />
            Check if I'm already registered
          </Button>
        </Link>
      </div>

      <Card className="max-w-xl mx-auto shadow-lg border-t-4" style={{ borderTopColor: project.theme_color }}>
        <CardHeader>
          <CardTitle>Registration Form</CardTitle>
          <CardDescription>
             {isFull ? (
               <span className="text-red-500 font-bold">Registration Full (名額已滿)</span>
             ) : (
               "Please fill in your details accurately."
             )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {project.fields.map(field => {
              const commonProps = {
                required: field.required,
                disabled: isFull,
                value: formData[field.id] || "",
                onChange: (e) => handleChange(field.id, e.target.value)
              }

              return (
                <div key={field.id} className="space-y-2">
                  <Label>
                    {field.label}
                    {field.required && <span className="text-red-400 ml-1">*</span>}
                  </Label>

                  {field.type === "textarea" ? (
                    <Textarea {...commonProps} />
                  ) : field.type === "select" ? (
                    <Select {...commonProps}>
                       <option value="">Select an option</option>
                       {field.options.split(",").map(opt => (
                         <option key={opt.trim()} value={opt.trim()}>{opt.trim()}</option>
                       ))}
                    </Select>
                  ) : field.type === "radio" ? (
                    <div className="flex flex-wrap gap-4 pt-1">
                      {field.options.split(",").map(opt => (
                        <label key={opt.trim()} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name={field.id}
                            value={opt.trim()}
                            checked={formData[field.id] === opt.trim()}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            disabled={isFull}
                            className="text-morandi-sage focus:ring-morandi-sage"
                            required={field.required}
                          />
                          <span className="text-sm text-morandi-dark">{opt.trim()}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <Input type={field.type} {...commonProps} />
                  )}
                </div>
              )
            })}

            <Button 
              type="submit" 
              className="w-full text-lg h-12" 
              style={{ backgroundColor: isFull ? undefined : project.theme_color }}
              disabled={isFull || submitting}
            >
              {isFull ? "Registration Closed" : "Submit Registration"}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <div className="text-center text-sm text-morandi-muted">
         Organizer: {project.organizer}
         {project.co_organizer && ` | Co-Organizer: ${project.co_organizer}`}
      </div>
    </div>
  )
}
