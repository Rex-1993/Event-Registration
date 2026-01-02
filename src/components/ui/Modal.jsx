import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card'
import { Button } from './Button'
import { Input } from './Input'
import { AlertCircle, CheckCircle2, HelpCircle, X } from 'lucide-react'

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  type = 'alert', // alert, confirm, prompt
  onConfirm, 
  confirmText = '確定',
  cancelText = '取消',
  defaultValue = ''
}) {
  const [inputValue, setInputValue] = useState(defaultValue)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setVisible(true)
      setInputValue(defaultValue)
    } else {
      const timer = setTimeout(() => setVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen, defaultValue])

  if (!visible && !isOpen) return null

  const handleConfirm = () => {
    if (type === 'prompt') {
      onConfirm(inputValue)
    } else {
      onConfirm()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleConfirm()
    if (e.key === 'Escape') onClose()
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <Card className={`relative w-full max-w-md bg-white/90 backdrop-blur-xl shadow-2xl border-0 ring-1 ring-black/5 transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            {type === 'alert' && <AlertCircle className="w-6 h-6 text-red-500" />}
            {type === 'confirm' && <HelpCircle className="w-6 h-6 text-primary-500" />}
            {type === 'prompt' && <CheckCircle2 className="w-6 h-6 text-indigo-500" />}
            <CardTitle className="text-xl text-neutral-800">{title}</CardTitle>
          </div>
          {description && <CardDescription className="pt-2 text-base text-neutral-600">{description}</CardDescription>}
        </CardHeader>

        <CardContent className="pt-4">
          {type === 'prompt' && (
            <Input 
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="mt-2"
              placeholder="請輸入..."
            />
          )}
        </CardContent>

        <CardFooter className="flex justify-end gap-3 bg-neutral-50/50 rounded-b-xl border-t border-neutral-100/50">
          {type !== 'alert' && (
            <Button variant="ghost" onClick={onClose} className="text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100">
              {cancelText}
            </Button>
          )}
          <Button 
            onClick={handleConfirm}
            className={`${type === 'alert' ? 'bg-red-500 hover:bg-red-600' : 'bg-primary-600 hover:bg-primary-700'} text-white shadow-md`}
          >
            {confirmText}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
