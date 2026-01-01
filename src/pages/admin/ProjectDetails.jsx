import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { getProject, getRegistrations } from "../../lib/api"
import { Button } from "../../components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card"
import { Loader2, Download, QrCode, ArrowLeft } from "lucide-react"
import * as XLSX from "xlsx"
import { QRCodeCanvas } from "qrcode.react"

export default function ProjectDetails() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [showQR, setShowQR] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const [projData, regData] = await Promise.all([
           getProject(id),
           getRegistrations(id)
        ])
        setProject(projData)
        setRegistrations(regData)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  const handleExport = () => {
    if (!registrations.length) return alert("No data to export")
    
    // Flatten data for Excel
    const dataToExport = registrations.map(reg => {
      // Basic info
      const row = {
        "Registration ID": reg.id,
        "Registration Date": reg.created_at ? new Date(reg.created_at.seconds * 1000).toLocaleString() : ""
      }
      
      // Dynamic fields
      // We should order them based on project fields config if possible, but map is easy
      Object.keys(reg.data).forEach(key => {
        // Find label if possible, else use key (which is ID). 
        // Ideally we map ID to Label using project.fields
        const fieldConfig = project.fields.find(f => f.id === key)
        const label = fieldConfig ? fieldConfig.label : key
        row[label] = reg.data[key]
      })
      
      return row
    })

    const ws = XLSX.utils.json_to_sheet(dataToExport)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Registrations")
    XLSX.writeFile(wb, `${project.title}_registrations.xlsx`)
  }

  const publicUrl = `${window.location.origin}/#/event/${id}`

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>
  if (!project) return <div className="p-10 text-center">Project not found</div>

  return (
    <div className="space-y-6">
       <Link to="/admin/projects" className="text-morandi-muted hover:text-morandi-dark flex items-center gap-2">
         <ArrowLeft className="w-4 h-4" /> Back to Dashboard
       </Link>

       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
           <h1 className="text-3xl font-bold text-morandi-dark">{project.title}</h1>
           <p className="text-morandi-muted">
             {registrations.length} / {project.max_participants} Participants
           </p>
         </div>
         <div className="flex gap-2">
           <Button variant="outline" onClick={() => setShowQR(!showQR)}>
             <QrCode className="w-4 h-4 mr-2" />
             {showQR ? "Hide QR" : "Show QR"}
           </Button>
           <Button onClick={handleExport}>
             <Download className="w-4 h-4 mr-2" />
             Export Excel
           </Button>
         </div>
       </div>

       {showQR && (
         <Card className="bg-white p-6 flex flex-col items-center justify-center animate-in fade-in slide-in-from-top-4">
            <QRCodeCanvas value={publicUrl} size={150} />
            <p className="mt-4 text-sm text-morandi-muted text-center break-all">{publicUrl}</p>
            <p className="text-sm font-medium mt-2">Scan to Register</p>
         </Card>
       )}

       <Card>
         <CardHeader>
           <CardTitle>Registrations</CardTitle>
         </CardHeader>
         <CardContent className="overflow-x-auto">
           <table className="w-full text-sm text-left">
             <thead className="bg-morandi-cream/50 text-morandi-dark uppercase font-medium">
               <tr>
                 <th className="p-3 rounded-tl-lg">Date</th>
                 {/* Show first 3-4 fields dynamically */}
                 {project.fields.slice(0, 4).map(f => (
                   <th key={f.id} className="p-3">{f.label}</th>
                 ))}
               </tr>
             </thead>
             <tbody>
               {registrations.length === 0 ? (
                 <tr>
                   <td colSpan={project.fields.length + 1} className="p-6 text-center text-morandi-muted">No registrations yet</td>
                 </tr>
               ) : (
                 registrations.map(reg => (
                   <tr key={reg.id} className="border-b border-morandi-grey/10 hover:bg-morandi-cream/20">
                     <td className="p-3">
                       {reg.created_at ? new Date(reg.created_at.seconds * 1000).toLocaleDateString() : '-'}
                     </td>
                     {project.fields.slice(0, 4).map(f => (
                       <td key={f.id} className="p-3 max-w-[200px] truncate">
                         {reg.data[f.id] || '-'}
                       </td>
                     ))}
                   </tr>
                 ))
               )}
             </tbody>
           </table>
         </CardContent>
       </Card>
    </div>
  )
}
