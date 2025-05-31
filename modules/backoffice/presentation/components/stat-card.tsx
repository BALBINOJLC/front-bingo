"use client"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  description?: string
}

export function StatCard({ title, value, icon: Icon, trend, description }: StatCardProps) {
  return (
    <div className="bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-yellow-400/20 rounded-lg">
          <Icon className="h-6 w-6 text-yellow-400" />
        </div>
        {trend && (
          <div className={`text-sm font-medium ${trend.isPositive ? "text-green-400" : "text-red-400"}`}>
            {trend.isPositive ? "+" : ""}
            {trend.value}%
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-white">{typeof value === "number" ? value.toLocaleString() : value}</h3>
        <p className="text-gray-300 text-sm">{title}</p>
        {description && <p className="text-gray-400 text-xs">{description}</p>}
      </div>
    </div>
  )
}
