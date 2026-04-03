import React from 'react'

export function Card({ className = '', children }) {
  return <div className={`card-shell ${className}`.trim()}>{children}</div>
}

export function CardHeader({ className = '', children }) {
  return <div className={`card-header ${className}`.trim()}>{children}</div>
}

export function CardTitle({ className = '', children }) {
  return <h3 className={`card-title ${className}`.trim()}>{children}</h3>
}

export function CardDescription({ className = '', children }) {
  return <p className={`card-description ${className}`.trim()}>{children}</p>
}

export function CardContent({ className = '', children }) {
  return <div className={`card-content ${className}`.trim()}>{children}</div>
}
