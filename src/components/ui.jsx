import React from 'react'

export function Card({ className = '', children }) {
  return <div className={className}>{children}</div>
}
export function CardHeader({ className = '', children }) {
  return <div className={`p-4 ${className}`}>{children}</div>
}
export function CardTitle({ className = '', children }) {
  return <h3 className={className}>{children}</h3>
}
export function CardDescription({ className = '', children }) {
  return <p className={`text-sm text-neutral-500 ${className}`}>{children}</p>
}
export function CardContent({ className = '', children }) {
  return <div className={`p-4 ${className}`}>{children}</div>
}
