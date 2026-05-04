import { create } from 'zustand'
import { ToastType } from '@/globals/enums'

export interface Toast {
  id: string
  type: ToastType | 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

interface ToastStore {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  clearAll: () => void
}

const DEFAULT_DURATION = 4000

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    const next: Toast = { duration: DEFAULT_DURATION, ...toast, id }
    set((state) => ({ toasts: [...state.toasts, next] }))
    return id
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  clearAll: () => set({ toasts: [] }),
}))
