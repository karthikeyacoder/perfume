"use client"

import { useEffect, useRef } from "react"

interface DataPoint {
  label: string
  value: number
  color?: string
}

interface SimpleChartProps {
  data: DataPoint[]
  title: string
  height?: number
  className?: string
}

export function SimpleChart({ data, title, height = 200, className = "" }: SimpleChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1
    canvas.width = canvas.offsetWidth * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    // Calculate max value for scaling
    const maxValue = Math.max(...data.map((d) => d.value), 1)

    // Draw bars
    const barWidth = (canvas.offsetWidth / data.length) * 0.8
    const spacing = (canvas.offsetWidth / data.length) * 0.2

    data.forEach((point, index) => {
      const x = index * (barWidth + spacing) + spacing / 2
      const barHeight = (point.value / maxValue) * (height - 60)

      // Draw bar
      ctx.fillStyle = point.color || "#4f46e5"
      ctx.fillRect(x, height - 40 - barHeight, barWidth, barHeight)

      // Draw label
      ctx.fillStyle = "#6b7280"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(point.label, x + barWidth / 2, height - 20)

      // Draw value
      ctx.fillStyle = "#111827"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(point.value.toString(), x + barWidth / 2, height - 45 - barHeight)
    })

    // Draw title
    ctx.fillStyle = "#111827"
    ctx.font = "bold 14px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(title, canvas.offsetWidth / 2, 20)
  }, [data, height, title])

  return (
    <div className={className}>
      <canvas ref={canvasRef} style={{ width: "100%", height: `${height}px` }} />
    </div>
  )
}

