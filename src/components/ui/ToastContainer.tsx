import { useToast } from '../../hooks/useToast.utils'
import type { ToastType } from '../../hooks/useToast'

const STYLES: Record<ToastType, { bg: string; icon: string }> = {
  success: { bg: 'bg-green-600', icon: '✓' },
  error: { bg: 'bg-red-600', icon: '✕' },
  info: { bg: 'bg-blue-600', icon: 'ℹ' },
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-sm:right-1/2 max-sm:translate-x-1/2 max-sm:w-[90vw]">
      {toasts.map(toast => {
        const style = STYLES[toast.type]
        return (
          <div
            key={toast.id}
            role="alert"
            className={`${style.bg} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[280px] animate-slide-up`}
          >
            <span className="text-lg font-bold shrink-0">{style.icon}</span>
            <span className="flex-1 text-sm">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 opacity-70 hover:opacity-100 text-lg leading-none cursor-pointer"
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        )
      })}
    </div>
  )
}
