import React, { useEffect, useRef } from 'react'

/**
 * Radar Chart for visualizing skill matching across categories
 * Pure Canvas implementation - no external chart libraries
 */
export default function SkillRadarChart({ data, size = 300 }) {
  const canvasRef = useRef(null)
  
  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const centerX = size / 2
    const centerY = size / 2
    const radius = (size / 2) - 40
    
    // Clear canvas
    ctx.clearRect(0, 0, size, size)
    
    // Draw grid circles
    const levels = 5
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)'
    ctx.lineWidth = 1
    for (let i = 1; i <= levels; i++) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, (radius / levels) * i, 0, Math.PI * 2)
      ctx.stroke()
    }
    
    // Draw axes and labels
    const angleStep = (Math.PI * 2) / data.length
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)'
    ctx.fillStyle = '#94a3b8'
    ctx.font = '12px Inter, sans-serif'
    ctx.textAlign = 'center'
    
    data.forEach((item, index) => {
      const angle = angleStep * index - Math.PI / 2
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)
      
      // Draw axis line
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.stroke()
      
      // Draw label
      const labelX = centerX + (radius + 25) * Math.cos(angle)
      const labelY = centerY + (radius + 25) * Math.sin(angle)
      
      // Wrap long labels
      const words = item.label.split(' ')
      if (words.length > 2) {
        ctx.fillText(words.slice(0, 2).join(' '), labelX, labelY - 6)
        ctx.fillText(words.slice(2).join(' '), labelX, labelY + 8)
      } else {
        ctx.fillText(item.label, labelX, labelY)
      }
    })
    
    // Draw data polygon
    ctx.beginPath()
    data.forEach((item, index) => {
      const angle = angleStep * index - Math.PI / 2
      const value = Math.min(item.value, 100) / 100
      const x = centerX + radius * value * Math.cos(angle)
      const y = centerY + radius * value * Math.sin(angle)
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.closePath()
    
    // Fill with gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
    gradient.addColorStop(0, 'rgba(34, 211, 238, 0.4)')
    gradient.addColorStop(1, 'rgba(168, 85, 247, 0.2)')
    ctx.fillStyle = gradient
    ctx.fill()
    
    // Stroke outline
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.8)'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Draw data points
    data.forEach((item, index) => {
      const angle = angleStep * index - Math.PI / 2
      const value = Math.min(item.value, 100) / 100
      const x = centerX + radius * value * Math.cos(angle)
      const y = centerY + radius * value * Math.sin(angle)
      
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#22d3ee'
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.stroke()
    })
    
  }, [data, size])
  
  if (!data || data.length === 0) {
    return (
      <div style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)',
        fontSize: '14px'
      }}>
        No data available
      </div>
    )
  }
  
  return (
    <canvas 
      ref={canvasRef} 
      width={size} 
      height={size}
      style={{
        maxWidth: '100%',
        height: 'auto'
      }}
    />
  )
}
