import { useEffect, useState } from "react"
import { getProject, getRegistrations, deleteProject, updateRegistration } from "../../lib/api"
import { useNavigate, useParams, Link } from "react-router-dom"
import { Button } from "../../components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card"
import { Loader2, Download, QrCode, ArrowLeft, Trash2, ExternalLink, Pencil } from "lucide-react"
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
  const [editingReg, setEditingReg] = useState(null) // Registration object being edited

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

  const handleUpdateRegistration = async (regId, data, searchName) => {
    await updateRegistration(regId, data, searchName)
    // Refresh local state
    setRegistrations(prev => prev.map(r => r.id === regId ? { ...r, data, search_name: searchName } : r))
    alert("資料更新成功！")
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
       <Link to="/admin/projects">
         <Button variant="outline" className="bg-gradient-to-r from-neutral-50 to-neutral-100 hover:from-neutral-100 hover:to-neutral-200 text-neutral-600 border-neutral-200 hover:border-neutral-300 transition-all">
            <ArrowLeft className="w-4 h-4 mr-2" /> 返回問卷列表
         </Button>
       </Link>

        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-neutral-200 pb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight">{project.title}</h1>
            <p className="text-neutral-500 mt-2 text-lg">
              <span className="font-semibold text-primary-600">{registrations.length}</span> / {parseInt(project.max_participants) === 0 ? "無限制" : project.max_participants} 已報名
            </p>
          </div>
          <div className="flex gap-3">
             <Button 
               onClick={() => setShowQR(!showQR)} 
               className={`
                 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 
                 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200
                 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 active:shadow-inner
               `}
             >
               <QrCode className="w-4 h-4 mr-2 text-white" />
               {showQR ? "隱藏 QR Code" : "顯示 QR Code"}
             </Button>
             <Button 
               onClick={handleExport} 
               className={`
                 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 
                 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200
                 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 active:shadow-inner
               `}
             >
               <Download className="w-4 h-4 mr-2 text-white" />
               匯出 Excel
             </Button>
          </div>
        </div>

        {/* QR Code Section with Accordion Animation */}
        <div 
          className={`
            overflow-hidden transition-all duration-500 ease-in-out
            ${showQR ? "max-h-[500px] opacity-100 mb-8" : "max-h-0 opacity-0 mb-0"}
          `}
        >
           <Card className="bg-white p-8 flex flex-col items-center justify-center shadow-xl border-2 border-primary-100 max-w-sm mx-auto transform transition-transform duration-500">
              <div className="bg-white p-2 rounded-xl shadow-inner mb-4">
                <QRCodeCanvas value={publicUrl} size={200} />
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
              <p className="text-lg font-bold mt-4 text-neutral-800">掃描 QR Code 進行報名</p>
           </Card>
        </div>

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
                   <th className="p-4 border-b border-neutral-200 whitespace-nowrap w-24">操作</th>
                   <th className="p-4 border-b border-neutral-200 whitespace-nowrap">報名日期</th>
                   {/* Show first 3-4 fields dynamically */}
                   {(project.fields || []).filter(f => !['section_title', 'divider'].includes(f.type)).map(f => (
                     <th key={f.id} className="p-4 border-b border-neutral-200 whitespace-nowrap">{f.label || f.id}</th>
                   ))}
                 </tr>
               </thead>
               <tbody className="divide-y divide-neutral-100">
                 {registrations.length === 0 ? (
                   <tr>
                     <td colSpan={(project.fields?.length || 0) + 1} className="p-10 text-center text-neutral-400">目前尚無報名資料</td>
                   </tr>
                 ) : (
                   registrations.map(reg => (
                     <tr key={reg.id} className="hover:bg-primary-50/30 transition-colors">
                       <td className="p-4 border-b border-neutral-100">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setEditingReg(reg)}
                            className="h-8 w-8 p-0 text-neutral-500 hover:text-primary-600 hover:bg-primary-50"
                            title="修改資料"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                       </td>
                       <td className="p-4 text-neutral-600 whitespace-nowrap">
                         {reg.created_at ? new Date(reg.created_at.seconds * 1000).toLocaleString() : '-'}
                       </td>
                       {(project.fields || []).filter(f => !['section_title', 'divider'].includes(f.type)).map(f => (
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

       <EditRegistrationModal 
         isOpen={!!editingReg} 
         onClose={() => setEditingReg(null)} 
         project={project}
         registration={editingReg}
         onUpdate={handleUpdateRegistration}
       />
    </div>
  )
}

function EditRegistrationModal({ isOpen, onClose, project, registration, onUpdate }) {
  const [formData, setFormData] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isOpen && registration) {
      setFormData(registration.data || {})
    }
  }, [isOpen, registration])

  const handleChange = (fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Confirmation Dialog
    if (!confirm("確定要修改這筆資料嗎？\n\n注意：此操作將直接覆蓋原始報名紀錄。")) {
        return;
    }

    setSaving(true)
    try {
      // Find name field to update search_name index
      const nameField = project.fields?.find(f => f.label === "姓名" || f.label === "Name") || project.fields?.[0]
      const searchName = nameField ? (formData[nameField.id] || "") : ""

      await onUpdate(registration.id, formData, searchName)
      onClose()
    } catch (error) {
      alert("更新失敗: " + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[50] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">
        <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-neutral-900">修改報名資料</h3>
          <Button variant="ghost" size="icon" onClick={onClose}><Trash2 className="w-5 h-5 rotate-45" /></Button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="edit-form" onSubmit={handleSubmit} className="space-y-6">
            {(project.fields || []).map(field => {
               if (field.type === "section_title") {
                 return (
                   <div key={field.id} className="pt-4 pb-1">
                      <h3 className="text-base font-bold text-neutral-800 border-l-4 pl-2 border-primary-500">
                        {field.label}
                      </h3>
                   </div>
                 )
               }
               
               if (field.type === "divider") {
                 return (
                   <div key={field.id} className="py-2">
                      <hr className="border-t border-neutral-200" />
                   </div>
                 )
               }

               return (
               <div key={field.id} className="space-y-2">
                 <label className="text-sm font-medium text-neutral-700">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                 </label>
                 {field.type === "textarea" ? (
                    <textarea 
                        className="flex min-h-[80px] w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData[field.id] || ""}
                        onChange={e => handleChange(field.id, e.target.value)}
                        required={field.required}
                    />
                 ) : field.type === "select" ? (
                    <select
                        className="flex h-10 w-full items-center justify-between rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData[field.id] || ""}
                        onChange={e => handleChange(field.id, e.target.value)}
                        required={field.required}
                    >
                        <option value="">請選擇...</option>
                        {field.options && field.options.split(",").map(opt => (
                            <option key={opt.trim()} value={opt.trim()}>{opt.trim()}</option>
                        ))}
                    </select>
                 ) : field.type === "radio" ? (
                    <div className="space-y-2">
                       {field.options && field.options.split(",").map(opt => {
                          const optionValue = opt.trim()
                          return (
                            <div key={optionValue} className="flex items-center space-x-2">
                                <input 
                                    type="radio" 
                                    id={`${field.id}-${optionValue}`}
                                    name={field.id}
                                    value={optionValue}
                                    checked={formData[field.id] === optionValue}
                                    onChange={e => handleChange(field.id, e.target.value)}
                                    className="h-4 w-4 border-neutral-300 text-primary-600 focus:ring-primary-600"
                                    required={field.required}
                                />
                                <label htmlFor={`${field.id}-${optionValue}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {optionValue}
                                </label>
                            </div>
                          )
                       })}
                    </div>
                 ) : field.type === "checkbox" ? (
                    <div className="space-y-2">
                       {field.options && field.options.split(",").map(opt => {
                          const optionValue = opt.trim()
                          const currentValues = Array.isArray(formData[field.id]) ? formData[field.id] : (formData[field.id] ? [formData[field.id]] : [])
                          const isChecked = currentValues.includes(optionValue)
                          
                          return (
                            <div key={optionValue} className="flex items-center space-x-2">
                                <input 
                                    type="checkbox" 
                                    id={`${field.id}-${optionValue}`}
                                    name={field.id}
                                    value={optionValue}
                                    checked={isChecked}
                                    onChange={e => {
                                        const newVal = e.target.checked 
                                            ? [...currentValues, optionValue]
                                            : currentValues.filter(v => v !== optionValue)
                                        handleChange(field.id, newVal)
                                    }}
                                    className="h-4 w-4 border-neutral-300 text-primary-600 focus:ring-primary-600 rounded"
                                />
                                <label htmlFor={`${field.id}-${optionValue}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {optionValue}
                                </label>
                            </div>
                          )
                       })}
                    </div>
                 ) : (
                    <input 
                        type={field.type}
                        className="flex h-10 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData[field.id] || ""}
                        onChange={e => handleChange(field.id, e.target.value)}
                        required={field.required}
                    />
                 )}
               </div>
            )})}
          </form>
        </div>

        <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex justify-end gap-3 rounded-b-2xl">
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button form="edit-form" type="submit" isLoading={saving} className="bg-primary-600 hover:bg-primary-700 text-white">儲存修改</Button>
        </div>
      </div>
    </div>
  )
}
