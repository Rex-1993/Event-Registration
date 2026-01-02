import { useEffect, useState } from "react"
import { getProject, getRegistrations, deleteProject } from "../../lib/api"
import { useNavigate, useParams, Link } from "react-router-dom"
import { Button } from "../../components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card"
import { Loader2, Download, QrCode, ArrowLeft, Trash2, ExternalLink } from "lucide-react"
import * as XLSX from "xlsx"
import { QRCodeCanvas } from "qrcode.react"

export default function ProjectDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showQR, setShowQR] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState("")

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
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  useEffect(() => {
    if (showQR) {
        // Small delay to ensure canvas is rendered
        setTimeout(() => {
            const canvas = document.getElementById("qr-canvas")
            if (canvas) {
                setQrCodeUrl(canvas.toDataURL("image/png"))
            }
        }, 100)
    }
  }, [showQR, project])

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
      if (reg.data) {
        Object.keys(reg.data).forEach(key => {
          // Find label if possible, else use key (which is ID). 
          // Ideally we map ID to Label using project.fields
          const fieldConfig = (project.fields || []).find(f => f.id === key)
          const label = fieldConfig ? fieldConfig.label : key
          row[label] = reg.data[key]
        })
      }
      
      return row
    })

    const ws = XLSX.utils.json_to_sheet(dataToExport)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Registrations")
    XLSX.writeFile(wb, `${project.title}_registrations.xlsx`)
  }

  const handleDelete = async () => {
    if (confirm(`確定要刪除專案「${project.title}」嗎？此動作無法復原。`)) {
      try {
        await deleteProject(id)
        navigate("/admin/projects")
      } catch (error) {
        alert("刪除專案時發生錯誤: " + error.message)
      }
    }
  }

  const publicUrl = `${window.location.href.split('#')[0]}#/event/${id}`

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary-600 h-8 w-8" /></div>
  
  if (error) return (
    <div className="p-20 text-center space-y-4">
      <div className="text-red-500 text-xl font-bold">載入失敗</div>
      <p className="text-neutral-500">{error}</p>
      <p className="text-sm text-neutral-400">請確認您的權限設定或網際網路連線。</p>
      <Link to="/admin/projects" className="text-primary-600 hover:underline">返回專案列表</Link>
    </div>
  )

  if (!project) return <div className="p-20 text-center text-neutral-500">找不到專案 (ID: {id})<br/><span className="text-xs text-neutral-400">請確認專案是否存在或重新整理</span></div>

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
       <Link to="/admin/projects" className="text-neutral-500 hover:text-primary-600 flex items-center gap-2 transition-colors">
         <ArrowLeft className="w-4 h-4" /> 返回專案列表
       </Link>

       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-neutral-200 pb-8">
         <div>
           <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight">{project.title}</h1>
           <p className="text-neutral-500 mt-2 text-lg">
             <span className="font-semibold text-primary-600">{registrations.length}</span> / {parseInt(project.max_participants) === 0 ? "無限制" : project.max_participants} 已報名
           </p>
         </div>
         <div className="flex gap-3">
           <Button variant="outline" onClick={() => setShowQR(!showQR)} className="shadow-sm hover:bg-neutral-50">
             <QrCode className="w-4 h-4 mr-2" />
             {showQR ? "隱藏 QR Code" : "顯示 QR Code"}
           </Button>
           <Button onClick={handleExport} className="shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
             <Download className="w-4 h-4 mr-2" />
             匯出 Excel
           </Button>
         </div>
       </div>

       {showQR && (
         <Card className="bg-white p-8 flex flex-col items-center justify-center animate-in fade-in slide-in-from-top-4 shadow-xl border-2 border-primary-100 max-w-sm mx-auto">
            <div className="bg-white p-2 rounded-xl shadow-inner mb-4">
               {/* Hidden Canvas for generation */}
               <div className="hidden">
                 <QRCodeCanvas value={publicUrl} size={300} id="qr-canvas" />
               </div>
               {/* Visible Image for easy saving */}
               {qrCodeUrl ? (
                 <img src={qrCodeUrl} alt="Scan to Register" className="w-[200px] h-[200px] object-contain" />
               ) : (
                 <div className="w-[200px] h-[200px] bg-neutral-100 animate-pulse rounded" />
               )}
            </div>
            <a 
              href={publicUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-2 text-sm text-primary-600 hover:text-primary-700 break-all text-center flex items-center gap-1.5 font-medium group"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {publicUrl}
            </a>
            <p className="text-lg font-bold mt-4 text-neutral-800">掃描(或長按) QR Code 進行報名</p>
         </Card>
       )}

       <Card className="shadow-lg overflow-hidden border-t-0">
         <CardHeader className="bg-neutral-50/50 border-b border-neutral-100">
           <CardTitle className="text-xl">回傳資料列表</CardTitle>
           <CardDescription>顯示所有參加者回傳的資料</CardDescription>
         </CardHeader>
         <CardContent className="p-0">
           <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
               <thead className="bg-neutral-50 text-neutral-700 uppercase font-semibold tracking-wider">
                 <tr>
                   <th className="p-4 border-b border-neutral-200 whitespace-nowrap">報名日期</th>
                   {/* Show all fields dynamically */}
                   {(project.fields || []).map(f => (
                     <th key={f.id} className="p-4 border-b border-neutral-200 whitespace-nowrap">{f.label || f.id}</th>
                   ))}
                 </tr>
               </thead>
               <tbody className="divide-y divide-neutral-100">
                 {registrations.length === 0 ? (
                   <tr>
                     <td colSpan={(project.fields?.length || 0) + 1} className="p-10 text-center text-neutral-400">目前尚無回傳資料</td>
                   </tr>
                 ) : (
                   registrations.map(reg => (
                     <tr key={reg.id} className="hover:bg-primary-50/30 transition-colors">
                       <td className="p-4 text-neutral-600 whitespace-nowrap">
                         {reg.created_at ? new Date(reg.created_at.seconds * 1000).toLocaleString() : '-'}
                       </td>
                       {(project.fields || []).map(f => (
                         <td key={f.id} className="p-4 text-neutral-800 font-medium max-w-[200px] truncate">
                           {reg.data?.[f.id] || '-'}
                         </td>
                       ))}
                     </tr>
                   ))
                 )}
               </tbody>
             </table>
           </div>
         </CardContent>
       </Card>
    </div>
  )
}
