// components/ui/Card.tsx
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  title?: string
  subtitle?: string
  footer?: ReactNode
  onClick?: () => void
}

export function Card({ children, className = '', title, subtitle, footer, onClick }: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md border overflow-hidden ${className}`}
      onClick={onClick}
    >
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b bg-gray-50">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t bg-gray-50">{footer}</div>
      )}
    </div>
  )
}