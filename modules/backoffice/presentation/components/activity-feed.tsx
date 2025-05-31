"use client"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { GamepadIcon, Trophy, UserPlus, LogIn } from "lucide-react"
import type { RecentActivity } from "../../domain/entities/dashboard.entity"

interface ActivityFeedProps {
  activities: RecentActivity[]
  title: string
}

export function ActivityFeed({ activities, title }: ActivityFeedProps) {
  const getActivityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "game":
        return GamepadIcon
      case "prize":
        return Trophy
      case "registration":
        return UserPlus
      case "login":
        return LogIn
      default:
        return GamepadIcon
    }
  }

  const getActivityColor = (type: RecentActivity["type"]) => {
    switch (type) {
      case "game":
        return "text-blue-400"
      case "prize":
        return "text-yellow-400"
      case "registration":
        return "text-green-400"
      case "login":
        return "text-purple-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="bg-black/20 backdrop-blur-md border border-yellow-500/20 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-6">{title}</h3>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = getActivityIcon(activity.type)
          const colorClass = getActivityColor(activity.type)

          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg bg-gray-800/50 ${colorClass}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm">{activity.description}</p>
                <p className="text-gray-400 text-xs mt-1">
                  {formatDistanceToNow(activity.timestamp, {
                    addSuffix: true,
                    locale: es,
                  })}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
