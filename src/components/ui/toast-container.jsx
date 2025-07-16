import * as React from "react"

import { cn } from "../../lib/utils"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider as ToastProviderPrimitive,
  ToastTitle,
  ToastViewport,
} from "./toast"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

export const toastTypes = {
  default: "default",
  destructive: "destructive",
}

let count = 0

function generateId() {
  return `toast-${++count}`
}

const toastTimeouts = new Map()

export const ToastContext = React.createContext({
  toast: () => {},
  dismiss: () => {},
})

export function useToast() {
  const context = React.useContext(ToastContext)

  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }

  return context
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([])

  const dismiss = React.useCallback((id) => {
    setToasts((toasts) => toasts.filter((t) => t.id !== id))
  }, [])

  const toast = React.useCallback(
    ({ title, description, type, duration = TOAST_REMOVE_DELAY, action }) => {
      const id = generateId()

      setToasts((toasts) => [
        ...toasts,
        { id, title, description, type, action },
      ])

      if (duration) {
        toastTimeouts.set(
          id,
          setTimeout(() => {
            toastTimeouts.delete(id)
            dismiss(id)
          }, duration)
        )
      }

      return id
    },
    [dismiss]
  )

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <ToastProviderPrimitive>
        {toasts.map(({ id, title, description, action, type }) => (
          <Toast key={id} onOpenChange={() => dismiss(id)} variant={type}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        ))}
        <ToastViewport />
      </ToastProviderPrimitive>
    </ToastContext.Provider>
  )
}
