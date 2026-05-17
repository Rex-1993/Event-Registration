import { useState, useEffect } from "react"
import { AlertCircle, HelpCircle, X } from "lucide-react"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { setDialogInstance } from "../lib/dialog"

export default function DialogContainer() {
  const [isOpen, setIsOpen] = useState(false)
  const [type, setType] = useState("alert") // "alert" | "confirm" | "prompt"
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [promptValue, setPromptValue] = useState("")
  const [resolvePromise, setResolvePromise] = useState(null)

  useEffect(() => {
    setDialogInstance({
      alert: (msg, t = "提示") => {
        return new Promise((resolve) => {
          setMessage(msg)
          setTitle(t)
          setType("alert")
          setIsOpen(true)
          setResolvePromise(() => resolve)
        })
      },
      confirm: (msg, t = "確認動作") => {
        return new Promise((resolve) => {
          setMessage(msg)
          setTitle(t)
          setType("confirm")
          setIsOpen(true)
          setResolvePromise(() => resolve)
        })
      },
      prompt: (msg, defaultVal = "", t = "輸入資料") => {
        return new Promise((resolve) => {
          setMessage(msg)
          setTitle(t)
          setType("prompt")
          setPromptValue(defaultVal)
          setIsOpen(true)
          setResolvePromise(() => resolve)
        })
      }
    })
    return () => setDialogInstance(null)
  }, [])

  const handleClose = (value) => {
    setIsOpen(false)
    if (resolvePromise) {
      if (type === "prompt") {
        resolvePromise(value ? promptValue : null)
      } else {
        resolvePromise(value)
      }
    }
  }

  if (!isOpen) return null

  const isConfirmLike = type === "confirm" || type === "prompt"

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={() => isConfirmLike ? handleClose(false) : handleClose(true)}
      />
      
      {/* Dialog Box */}
      <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-md overflow-hidden relative z-[10000] animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex items-center gap-2">
            {type === "alert" ? (
              <AlertCircle className="w-5 h-5 text-primary-600" />
            ) : (
              <HelpCircle className="w-5 h-5 text-amber-500" style={{ color: type === "prompt" ? "#3b82f6" : undefined }} />
            )}
            <span className="font-semibold text-neutral-800">{title}</span>
          </div>
          <button 
            onClick={() => handleClose(isConfirmLike ? false : true)}
            className="text-neutral-400 hover:text-neutral-600 rounded-lg p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 text-sm text-neutral-600 flex-1 flex flex-col max-h-[60vh] overflow-y-auto">
          <div className="whitespace-pre-line leading-relaxed">{message}</div>
          {type === "prompt" && (
            <Input
              value={promptValue}
              onChange={e => setPromptValue(e.target.value)}
              className="mt-4 focus:ring-primary-500 w-full"
              placeholder="請輸入..."
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleClose(true)
                if (e.key === "Escape") handleClose(false)
              }}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/30 flex justify-end gap-2">
          {isConfirmLike ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleClose(false)}
                className="px-4 py-2 text-neutral-600 border-neutral-200 hover:bg-neutral-100/50 rounded-lg text-sm"
              >
                取消
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleClose(true)}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm shadow-sm ring-1 ring-primary-500/20"
              >
                確定
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => handleClose(true)}
              className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm shadow-sm ring-1 ring-primary-500/20"
            >
              確定
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
