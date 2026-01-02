import React, { createContext, useContext, useState, useCallback, useRef } from 'react'
import { Modal } from './Modal'

const ModalContext = createContext(null)

export function useModal() {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}

export function ModalProvider({ children }) {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'alert',
    confirmText: '確定',
    cancelText: '取消',
    defaultValue: ''
  })

  // We use a ref to store the resolve function of the current promise
  const resolverRef = useRef(null)

  const close = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }))
    if (resolverRef.current) {
      if (modalState.type === 'confirm') resolverRef.current(false)
      else if (modalState.type === 'prompt') resolverRef.current(null)
      else resolverRef.current() // alert
      resolverRef.current = null
    }
  }, [modalState.type])

  const confirm = useCallback((value) => {
    setModalState(prev => ({ ...prev, isOpen: false }))
    if (resolverRef.current) {
      if (modalState.type === 'confirm') resolverRef.current(true)
      else if (modalState.type === 'prompt') resolverRef.current(value)
      else resolverRef.current() // alert
      resolverRef.current = null
    }
  }, [modalState.type])

  const show = useCallback(({ title, description, type = 'alert', confirmText, cancelText, defaultValue = '' }) => {
    // If there is an existing modal open, we might need to close it or queue it. 
    // For simplicity, we just replace it, but we should reject the previous promise.
    if (resolverRef.current) {
       resolverRef.current(null) // Cancel previous
    }

    setModalState({
      isOpen: true,
      title,
      description,
      type,
      confirmText: confirmText || '確定',
      cancelText: cancelText || '取消',
      defaultValue
    })

    return new Promise((resolve) => {
      resolverRef.current = resolve
    })
  }, [])

  const alert = useCallback((message, title = '提示') => {
    return show({ title, description: message, type: 'alert' })
  }, [show])

  const confirmModal = useCallback((message, title = '確認') => {
    return show({ title, description: message, type: 'confirm' })
  }, [show])

  const prompt = useCallback((message, defaultValue = '', title = '輸入') => {
    return show({ title, description: message, type: 'prompt', defaultValue })
  }, [show])

  return (
    <ModalContext.Provider value={{ alert, confirm: confirmModal, prompt }}>
      {children}
      <Modal
        isOpen={modalState.isOpen}
        onClose={close}
        onConfirm={confirm}
        title={modalState.title}
        description={modalState.description}
        type={modalState.type}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        defaultValue={modalState.defaultValue}
      />
    </ModalContext.Provider>
  )
}
